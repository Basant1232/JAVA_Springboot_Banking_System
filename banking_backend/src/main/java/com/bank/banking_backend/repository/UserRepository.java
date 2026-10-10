package com.bank.banking_backend.repository;

import com.bank.banking_backend.entity.Customer;
import com.bank.banking_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository  extends JpaRepository<User, Long> {

    Optional<User> findByUserName(String userName);

    Optional<User> findByCustomer(Customer customer);

    boolean existsByUserName(String userName);

}
