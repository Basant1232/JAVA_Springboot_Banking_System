package com.bank.banking_backend.service;

import com.bank.banking_backend.dto.TransactionRequest;
import com.bank.banking_backend.dto.TransactionResponse;
import com.bank.banking_backend.dto.TransactionStatementResponse;
import com.bank.banking_backend.dto.TransferRequest;
import com.bank.banking_backend.entity.Transaction;

import java.math.BigDecimal;
import java.util.List;

public interface TransactionService {

    TransactionResponse deposit(TransactionRequest request);

    TransactionResponse withdraw(TransactionRequest request);

    TransactionResponse transfer(TransferRequest request);

    List<TransactionResponse> getTransactionsByAccount(Long accountId);

    TransactionStatementResponse getStatement(Long accountId, int page, int size);

    List<TransactionResponse> getTransactionsByCustomerId(Long customerId);
}
