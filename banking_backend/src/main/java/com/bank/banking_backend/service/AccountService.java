package com.bank.banking_backend.service;
import java.util.List;
import com.bank.banking_backend.dto.AccountRequest;
import com.bank.banking_backend.dto.AccountResponse;
import com.bank.banking_backend.entity.Account;

import java.util.List;

public interface AccountService {

    AccountResponse createAccount(AccountRequest request);

    List<AccountResponse> getAllAccounts();

    AccountResponse getAccountById(Long accountId);

    AccountResponse updateAccount(Long accountId, AccountRequest request);

    void deleteAccount(Long accountId);

    boolean isAccountOwnedByCustomer(Long accountId, Long customerId);

    List<AccountResponse> getAccountsByCustomerId(Long customerId);

}
