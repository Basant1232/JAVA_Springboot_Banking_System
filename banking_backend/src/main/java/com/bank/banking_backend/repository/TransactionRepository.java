package com.bank.banking_backend.repository;

import com.bank.banking_backend.entity.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository  extends JpaRepository<Transaction , Long> {

    List<Transaction> findByAccountAccountIdOrderByTransactionDateDesc(Long accountId);

    Page<Transaction> findByAccountAccountIdOrderByTransactionDateDesc(Long accountId, Pageable pageable);

    @Query("""
    SELECT t
    FROM Transaction t
    WHERE t.account.customer.customerId = :customerId
    ORDER BY t.transactionDate DESC
""")
    List<Transaction> findByCustomerId(@Param("customerId") Long customerId);
}
