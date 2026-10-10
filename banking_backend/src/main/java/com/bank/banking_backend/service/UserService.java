package com.bank.banking_backend.service;

import com.bank.banking_backend.dto.LoginRequest;
import com.bank.banking_backend.dto.LoginResponse;
import com.bank.banking_backend.dto.RegisterRequest;
import com.bank.banking_backend.dto.UserResponse;
import com.bank.banking_backend.entity.Customer;
import com.bank.banking_backend.entity.User;
import com.bank.banking_backend.repository.CustomerRepository;
import com.bank.banking_backend.repository.UserRepository;
import com.bank.banking_backend.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CustomerRepository customerRepository;
    private final JwtService jwtService;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       CustomerRepository customerRepository,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.customerRepository = customerRepository;
        this.jwtService = jwtService;
    }

    public UserResponse createUser(RegisterRequest request) {

        if (userRepository.existsByUserName(request.getUserName())) {
            throw new RuntimeException("Username already exists");
        }

        User user = new User();
        user.setUserName(request.getUserName());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() == null || request.getRole().isBlank()
                ? "CUSTOMER"
                : request.getRole());
        user.setEnabled(true);

        if (request.getCustomerId() != null) {
            Customer customer = customerRepository.findById(request.getCustomerId())
                    .orElseThrow(() -> new RuntimeException(
                            "Customer not found with ID: " + request.getCustomerId()));

            user.setCustomer(customer);
        }

        User savedUser = userRepository.save(user);

        return new UserResponse(
                savedUser.getUserId(),
                savedUser.getUserName(),
                savedUser.getRole(),
                savedUser.isEnabled(),
                savedUser.getCustomer() != null
                        ? savedUser.getCustomer().getCustomerId()
                        : null
        );
    }

    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByUserName(request.getUserName())
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));

        if (!user.isEnabled()) {
            throw new RuntimeException("User account is disabled");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }

        Long customerId = user.getCustomer() != null
                ? user.getCustomer().getCustomerId()
                : null;

        String token = jwtService.generateToken(
                user.getUserName(),
                user.getRole(),
                user.getUserId(),
                customerId
        );

        return new LoginResponse(
                user.getUserId(),
                user.getUserName(),
                user.getRole(),
                user.isEnabled(),
                customerId,
                token
        );
    }

    public User findByUserName(String userName) {
        return userRepository.findByUserName(userName)
                .orElseThrow(() ->
                        new RuntimeException("User not found with Username " + userName));
    }
}