package com.bank.banking_backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class TransactionStatementResponse {

    private Long accountId;

    private String accountNumber;

    private BigDecimal currentBalance;

    private int currentPage;

    private int pageSize;

    private int totalPages;

    private long totalTransactions;

    private boolean firstPage;

    private boolean lastPage;

    private List<TransactionResponse> transactions;
}
