package com.bank.banking_backend.controller;

import com.bank.banking_backend.dto.AccountRequest;
import com.bank.banking_backend.dto.AccountResponse;
import com.bank.banking_backend.dto.ApiResponse;
import com.bank.banking_backend.entity.User;
import com.bank.banking_backend.service.AccountService;
import com.bank.banking_backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")

public class AccountController {

    private final AccountService accountService;
    private final UserService userService;

    public AccountController(AccountService accountService, UserService userService) {
        this.accountService = accountService;
        this.userService = userService;
    }

    @PostMapping
    public ApiResponse<AccountResponse> createAccount(
            @Valid @RequestBody AccountRequest request){

        return new ApiResponse<>(
                true,
                "Account created successfully",
                accountService.createAccount(request)
        );
    }

    @GetMapping
    public ApiResponse<List<AccountResponse>> getAllAccounts(){

        return new ApiResponse<>(
                true,
                "Accounts fetched successfully",
                accountService.getAllAccounts()
        );
    }

    @GetMapping("/{id}")
    public ApiResponse<AccountResponse> getAccountById(
            @PathVariable Long id){

        return new ApiResponse<>(
                true,
                "Account fetched successfully",
                accountService.getAccountById(id)
        );
    }


    @PutMapping("/{id}")
    public ApiResponse<AccountResponse> updateAccount(
            @PathVariable Long id,
           @Valid @RequestBody AccountRequest request){

        return new ApiResponse<>(
                true,
                "Account updated successfully",
                accountService.updateAccount(id, request)
        );
    }


    @GetMapping("/my-accounts")
    public ResponseEntity<ApiResponse<List<AccountResponse>>> getMyAccounts(
            Authentication authentication) {

        String username = authentication.getName();

        User user = userService.findByUserName(username);

        if (user.getCustomer() == null) {
            throw new RuntimeException(
                    "No customer linked to this user"
            );
        }

        Long customerId = user.getCustomer().getCustomerId();

        List<AccountResponse> accounts =
                accountService.getAccountsByCustomerId(customerId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Customer accounts fetched successfully",
                        accounts
                )
        );
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteAccount(
            @PathVariable Long id){

        accountService.deleteAccount(id);

        return new ApiResponse<>(
                true,
                "Account deleted successfully",
                null
        );
    }

}
