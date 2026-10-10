package com.bank.banking_backend.controller;

import com.bank.banking_backend.dto.*;
import com.bank.banking_backend.entity.User;
import com.bank.banking_backend.service.AccountService;
import com.bank.banking_backend.service.TransactionService;
import com.bank.banking_backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;
    private final UserService userService;
    private final AccountService accountService;

    public TransactionController(TransactionService transactionService,
                                 UserService userService,  AccountService accountService) {

        this.transactionService = transactionService;
        this.userService = userService;
        this.accountService = accountService;
    }

    @PostMapping("/deposit")
    public ApiResponse<TransactionResponse> deposit
            ( @Valid @RequestBody TransactionRequest request){

        return new ApiResponse<>(
                true,
                "Amount deposited successfully",
                transactionService.deposit(request)
        );
    }

    @PostMapping("/withdraw")
    public ApiResponse<TransactionResponse> withdraw(
            @Valid @RequestBody TransactionRequest request){

        return new ApiResponse<>(
                true,
                "Amount withdrawn successfully",
                transactionService.withdraw(request)
        );
    }

    @PostMapping("/transfer")
    public ApiResponse<TransactionResponse> transfer(
            @Valid @RequestBody TransferRequest request){

        return new ApiResponse<>(
                true,
                "Amount transferred successfully",
                transactionService.transfer(request)
        );
    }

    @GetMapping("/my-transactions")
    public ApiResponse<List<TransactionResponse>> getMyTransactions(Authentication authentication) {

        String username = authentication.getName();

        User user = userService.findByUserName(username);

        if (user.getCustomer() == null) {
            throw new RuntimeException(
                    "No customer linked to this user"
            );
        }

        Long customerId = user.getCustomer().getCustomerId();

        return new ApiResponse<>(
                true,
                "Customer transactions fetched successfully",
                transactionService.getTransactionsByCustomerId(customerId)
        );
    }

    @GetMapping("/account/{accountId}")
    public ApiResponse<List<TransactionResponse>> getTransactionsByAccount(
            @PathVariable Long accountId){


        return new ApiResponse<>(
                true,
                "Transactions fetched successfully",
                transactionService.getTransactionsByAccount(accountId)
        );
    }

    @GetMapping("/account/{accountId}/statement")
    public ResponseEntity<ApiResponse<TransactionStatementResponse>> getStatement(
            @PathVariable Long accountId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication){

        String username = authentication.getName();

        User user = userService.findByUserName(username);

        if ("ADMIN".equals(user.getRole())) {

            return ResponseEntity.ok(
                    new ApiResponse<>(
                            true,
                            "Statement fetched successfully",
                            transactionService.getStatement(
                                    accountId,
                                    page,
                                    size
                            )
                    )
            );
        }


        if (user.getCustomer() == null){
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ApiResponse<>(
                            false,
                            "No customer linked to this user",
                            null
                    ));
        }

        Long customerId = user.getCustomer().getCustomerId();

        boolean owned = accountService.isAccountOwnedByCustomer(
                accountId,
                customerId
        );

        if (!owned) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ApiResponse<>(
                            false,
                            "You are not authorized to access this account",
                            null
                    ));
        }

        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Statement fetched successfully",
                transactionService.getStatement(accountId, page, size))
        );

    }


}
