package com.bank.banking_backend.service;

import com.bank.banking_backend.dto.CustomerRequest;
import com.bank.banking_backend.dto.CustomerResponse;

import java.util.List;

public interface CustomerService {

    CustomerResponse save(CustomerRequest customerRequest);

    List<CustomerResponse> getAllCustomers();

    CustomerResponse getCustomerById(Long id);

    void deleteCustomer(Long id);

    CustomerResponse getCustomerByUsername(String username);
}