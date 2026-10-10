package com.bank.banking_backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name="transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString

public class Transaction {

    @Id
    @GeneratedValue(strategy  = GenerationType.IDENTITY)
    private Long transactionId;

    private String transactionType;

    private BigDecimal amount;

    private LocalDateTime transactionDate;

    private String remarks;

    @ManyToOne
    @JoinColumn(name= "account_id")
    @JsonIgnore
    private Account account;

}
