package com.bank.banking_backend.service;

import com.bank.banking_backend.dto.AccountRequest;
import com.bank.banking_backend.dto.AccountResponse;
import com.bank.banking_backend.entity.Account;
import com.bank.banking_backend.entity.Customer;
import com.bank.banking_backend.exception.ResourceNotFoundException;
import com.bank.banking_backend.repository.AccountRepository;
import com.bank.banking_backend.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;
    private final CustomerRepository customerRepository;

    public AccountServiceImpl(AccountRepository accountRepository,
                              CustomerRepository customerRepository) {
        this.accountRepository = accountRepository;
        this.customerRepository = customerRepository;
    }

    @Override
    public AccountResponse createAccount(AccountRequest accountRequest) {

        Customer customer = customerRepository.findById(accountRequest.getCustomerId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Customer not found with id : " + accountRequest.getCustomerId()
                        ));

        if (accountRequest.getBalance() != null &&
                accountRequest.getBalance().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Initial Balance cannot be negative.");
        }

        Account account = new Account();
        account.setAccountType(accountRequest.getAccountType());
        account.setBalance(
                accountRequest.getBalance() != null
                        ? accountRequest.getBalance()
                        : BigDecimal.ZERO
        );
        account.setCustomer(customer);

        Account savedAccount = accountRepository.save(account);

        savedAccount.setAccountNumber(
                generateAccountNumber(savedAccount.getAccountId())
        );

        return mapToResponse(accountRepository.save(savedAccount));
    }

    @Override
    public List<AccountResponse> getAllAccounts() {
        return accountRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public AccountResponse getAccountById(Long id) {

        Account account = accountRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Account not found with id : " + id
                        ));

        return mapToResponse(account);
    }

    @Override
    public AccountResponse updateAccount(Long accountId,
                                         AccountRequest accountRequest) {

        Account existingAccount = accountRepository.findById(accountId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Account not found"));

        existingAccount.setAccountType(accountRequest.getAccountType());
        existingAccount.setBalance(accountRequest.getBalance());

        return mapToResponse(accountRepository.save(existingAccount));
    }

    @Override
    public void deleteAccount(Long id) {
        accountRepository.deleteById(id);
    }

    private String generateAccountNumber(Long accountId) {
        return String.format("ACC%06d", 100000 + accountId);
    }

    @Override
    public List<AccountResponse> getAccountsByCustomerId(Long customerId) {
        return accountRepository.findByCustomerCustomerId(customerId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public boolean isAccountOwnedByCustomer(Long accountId, Long customerId) {

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Account not found"));

        return account.getCustomer() != null &&
                account.getCustomer().getCustomerId().equals(customerId);
    }

    private AccountResponse mapToResponse(Account account) {

        AccountResponse response = new AccountResponse();

        response.setAccountId(account.getAccountId());
        response.setAccountNumber(account.getAccountNumber());
        response.setAccountType(account.getAccountType());
        response.setBalance(account.getBalance());
        response.setCustomerId(account.getCustomer().getCustomerId());
        response.setCustomerName(
                account.getCustomer().getFirstName() + " " +
                        account.getCustomer().getLastName()
        );

        return response;
    }
}