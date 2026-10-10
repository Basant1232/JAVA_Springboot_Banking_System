package com.bank.banking_backend.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;


@Data
@Getter
@Setter
public class CustomerResponse {

    private Long customerId;

    private String firstName;

    private String lastName;

    private String email;

    private String mobile;

    private String address;

    private LocalDateTime createdAt;
}
