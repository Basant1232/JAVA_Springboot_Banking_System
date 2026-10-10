package com.bank.banking_backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CustomerRequest {

    @NotBlank(message = "First Name is required")
    @Size(
            min = 2,
            max = 50,
            message = "First name should be between 2 and 50 characters"
    )
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(
            min = 2,
            max = 50,
            message = "Last name should be between 2 and 50 characters"
    )
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "Mobile number is required")
    @Pattern(
            regexp = "^[0-9]{10}$",
            message = "Mobile number must contain 10 digits"
    )
    private String mobile;

    @NotBlank(message = "Address is required")
    private String address;

/*  user login details */
    @NotBlank(message = "Username is required")
    @Size(
            min = 4,
            max = 50,
            message = "Username should be between 4 and 50 characters"
    )
    private String userName;

    @NotBlank(message = "Password is required")
    @Size(
            min = 6,
            max = 100,
            message = "Password should be at least 6 characters"
    )
    private String password;
}