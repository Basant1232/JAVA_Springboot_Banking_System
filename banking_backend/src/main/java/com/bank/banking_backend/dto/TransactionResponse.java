package com.bank.banking_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponse {

    private Long transactionId;

    private String transactionType;

    private BigDecimal amount;

    private LocalDateTime transactionDate;

    private String remarks;

    private Long accountId;

    private String accountNumber;
}
