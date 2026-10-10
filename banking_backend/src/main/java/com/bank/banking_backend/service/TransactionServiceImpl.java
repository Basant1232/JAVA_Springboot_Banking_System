package com.bank.banking_backend.service;

import com.bank.banking_backend.dto.TransactionRequest;
import com.bank.banking_backend.dto.TransactionResponse;
import com.bank.banking_backend.dto.TransactionStatementResponse;
import com.bank.banking_backend.dto.TransferRequest;
import com.bank.banking_backend.entity.Account;
import com.bank.banking_backend.entity.Transaction;
import com.bank.banking_backend.exception.InvalidTransactionException;
import com.bank.banking_backend.exception.ResourceNotFoundException;
import com.bank.banking_backend.repository.AccountRepository;
import com.bank.banking_backend.repository.TransactionRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;

    public TransactionServiceImpl(TransactionRepository transactionRepository,
                                  AccountRepository accountRepository) {
        this.transactionRepository = transactionRepository;
        this.accountRepository = accountRepository;
    }

    @Override
    @Transactional
    public TransactionResponse deposit(TransactionRequest request) {

        if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidTransactionException("Deposit amount must be greater than zero");
        }

        Account account = accountRepository.findById(request.getAccountId())
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        account.setBalance(account.getBalance().add(request.getAmount()));
        accountRepository.save(account);

        Transaction transaction = new Transaction();
        transaction.setAccount(account);
        transaction.setAmount(request.getAmount());
        transaction.setTransactionType("Deposit");
        transaction.setTransactionDate(LocalDateTime.now());
        transaction.setRemarks(request.getRemarks());

        return mapToResponse(transactionRepository.save(transaction));
    }

    @Override
    @Transactional
    public TransactionResponse withdraw(TransactionRequest request) {

        if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidTransactionException("Withdrawal amount must be greater than zero");
        }

        Account account = accountRepository.findById(request.getAccountId())
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        if (account.getBalance().compareTo(request.getAmount()) < 0) {
            throw new InvalidTransactionException("Insufficient balance");
        }

        account.setBalance(account.getBalance().subtract(request.getAmount()));
        accountRepository.save(account);

        Transaction transaction = new Transaction();
        transaction.setAccount(account);
        transaction.setAmount(request.getAmount());
        transaction.setTransactionType("Withdraw");
        transaction.setTransactionDate(LocalDateTime.now());
        transaction.setRemarks(request.getRemarks());

        return mapToResponse(transactionRepository.save(transaction));
    }

    @Override
    @Transactional
    public TransactionResponse transfer(TransferRequest request) {

        Account fromAccount = accountRepository.findById(request.getFromAccountId())
                .orElseThrow(() -> new ResourceNotFoundException("Sender account not found"));

        Account toAccount = accountRepository.findById(request.getToAccountId())
                .orElseThrow(() -> new ResourceNotFoundException("Receiver account not found"));

        if (fromAccount.getAccountId().equals(toAccount.getAccountId())) {
            throw new InvalidTransactionException(
                    "Sender and Receiver account cannot be the same."
            );
        }

        if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidTransactionException("Transfer amount must be greater than zero");
        }

        if (fromAccount.getBalance().compareTo(request.getAmount()) < 0) {
            throw new InvalidTransactionException("Insufficient balance");
        }

        fromAccount.setBalance(
                fromAccount.getBalance().subtract(request.getAmount())
        );

        toAccount.setBalance(
                toAccount.getBalance().add(request.getAmount())
        );

        accountRepository.save(fromAccount);
        accountRepository.save(toAccount);

        Transaction debitTransaction = new Transaction();
        debitTransaction.setAccount(fromAccount);
        debitTransaction.setAmount(request.getAmount());
        debitTransaction.setTransactionType("DEBIT");
        debitTransaction.setTransactionDate(LocalDateTime.now());
        debitTransaction.setRemarks(
                "Transferred to account " + toAccount.getAccountNumber()
        );

        transactionRepository.save(debitTransaction);

        Transaction creditTransaction = new Transaction();
        creditTransaction.setAccount(toAccount);
        creditTransaction.setAmount(request.getAmount());
        creditTransaction.setTransactionType("CREDIT");
        creditTransaction.setTransactionDate(LocalDateTime.now());
        creditTransaction.setRemarks(
                "Received from account " + fromAccount.getAccountNumber()
        );

        return mapToResponse(transactionRepository.save(creditTransaction));
    }

    @Override
    public List<TransactionResponse> getTransactionsByAccount(Long accountId) {

        accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        return transactionRepository
                .findByAccountAccountIdOrderByTransactionDateDesc(accountId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<TransactionResponse> getTransactionsByCustomerId(Long customerId) {

        return transactionRepository.findByCustomerId(customerId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public TransactionStatementResponse getStatement(Long accountId, int page, int size) {

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        Pageable pageable = PageRequest.of(page, size);

        Page<Transaction> transactionPage =
                transactionRepository.findByAccountAccountIdOrderByTransactionDateDesc(
                        accountId,
                        pageable
                );

        List<TransactionResponse> transactions = transactionPage.getContent()
                .stream()
                .map(this::mapToResponse)
                .toList();

        TransactionStatementResponse response = new TransactionStatementResponse();

        response.setAccountId(account.getAccountId());
        response.setAccountNumber(account.getAccountNumber());
        response.setCurrentBalance(account.getBalance());
        response.setCurrentPage(transactionPage.getNumber());
        response.setPageSize(transactionPage.getSize());
        response.setTotalPages(transactionPage.getTotalPages());
        response.setTotalTransactions(transactionPage.getTotalElements());
        response.setFirstPage(transactionPage.isFirst());
        response.setLastPage(transactionPage.isLast());
        response.setTransactions(transactions);

        return response;
    }

    private TransactionResponse mapToResponse(Transaction transaction) {

        TransactionResponse response = new TransactionResponse();

        response.setTransactionId(transaction.getTransactionId());
        response.setTransactionType(transaction.getTransactionType());
        response.setAmount(transaction.getAmount());
        response.setTransactionDate(transaction.getTransactionDate());
        response.setRemarks(transaction.getRemarks());
        response.setAccountId(transaction.getAccount().getAccountId());
        response.setAccountNumber(transaction.getAccount().getAccountNumber());

        return response;
    }
}