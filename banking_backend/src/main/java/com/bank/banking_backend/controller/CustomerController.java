package com.bank.banking_backend.controller;

import com.bank.banking_backend.dto.ApiResponse;
import com.bank.banking_backend.dto.CustomerRequest;
import com.bank.banking_backend.dto.CustomerResponse;
import com.bank.banking_backend.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/customers")

public class CustomerController {

    private final CustomerService customerService;

    public CustomerController( CustomerService customerService){
        this.customerService = customerService;
    }

    @PostMapping
    public ApiResponse<CustomerResponse> saveCustomer
            (@Valid @RequestBody CustomerRequest customerRequest){

        CustomerResponse response = customerService.save(customerRequest);

        return new ApiResponse<>(
                true,
                "Customer saved successfully",
                response
        );
    }

    @GetMapping
    public ApiResponse<List<CustomerResponse>> getAllCustomers(){

        return new ApiResponse<>(

                true,
                "Customer fetched successfully",
                customerService.getAllCustomers()
        );
    }

    @GetMapping("/{id}")
    public ApiResponse<CustomerResponse> getCustomerById(@PathVariable Long id){

        return new ApiResponse<>(
                true,
                "Customer retrieved successfully",
                customerService.getCustomerById(id)
        );
    }


    @GetMapping("/my-profile")
    public ResponseEntity<ApiResponse<CustomerResponse>> getMyProfile(
            Authentication authentication) {

        String username = authentication.getName();

        CustomerResponse customer =
                customerService.getCustomerByUsername(username);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Customer profile fetched successfully",
                        customer
                )
        );
    }


    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteCustomer(@PathVariable Long id){

        customerService.deleteCustomer(id);

        return new ApiResponse<>(
                true,
                "Customer deleted successfully",
                null
        );
    }

}
