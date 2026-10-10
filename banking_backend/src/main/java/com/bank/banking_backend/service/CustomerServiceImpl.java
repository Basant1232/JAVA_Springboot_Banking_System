package com.bank.banking_backend.service;

import com.bank.banking_backend.dto.CustomerRequest;
import com.bank.banking_backend.dto.CustomerResponse;
import com.bank.banking_backend.entity.Customer;
import com.bank.banking_backend.entity.User;
import com.bank.banking_backend.exception.DuplicateResourceException;
import com.bank.banking_backend.exception.ResourceNotFoundException;
import com.bank.banking_backend.repository.CustomerRepository;
import com.bank.banking_backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public CustomerServiceImpl(CustomerRepository customerRepository,
                               UserRepository userRepository,
                               PasswordEncoder passwordEncoder) {
        this.customerRepository = customerRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public CustomerResponse save(CustomerRequest customerRequest) {

        if (customerRepository.existsByEmail(customerRequest.getEmail())) {
            throw new DuplicateResourceException("Email already exists.");
        }

        if (customerRepository.existsByMobile(customerRequest.getMobile())) {
            throw new DuplicateResourceException("Mobile number already exists.");
        }

        if (userRepository.existsByUserName(customerRequest.getUserName())) {
            throw new DuplicateResourceException("Username already exists.");
        }

        Customer customer = new Customer();
        customer.setFirstName(customerRequest.getFirstName());
        customer.setLastName(customerRequest.getLastName());
        customer.setEmail(customerRequest.getEmail());
        customer.setMobile(customerRequest.getMobile());
        customer.setAddress(customerRequest.getAddress());
        customer.setCreatedAt(LocalDateTime.now());

        Customer savedCustomer = customerRepository.save(customer);

        User user = new User();
        user.setUserName(customerRequest.getUserName());
        user.setPassword(passwordEncoder.encode(customerRequest.getPassword()));
        user.setRole("CUSTOMER");
        user.setEnabled(true);
        user.setCustomer(savedCustomer);

        userRepository.save(user);

        return mapToResponse(savedCustomer);
    }

    @Override
    public List<CustomerResponse> getAllCustomers() {
        return customerRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public CustomerResponse getCustomerById(Long id) {

        Customer customer = customerRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Customer not found with id : " + id
                        )
                );

        return mapToResponse(customer);
    }

    @Override
    @Transactional
    public void deleteCustomer(Long id) {

        Customer customer = customerRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Customer not found with id : " + id
                        )
                );

        userRepository.findByCustomer(customer).ifPresent(user -> {
            user.setCustomer(null);
            userRepository.saveAndFlush(user);
            userRepository.delete(user);
            userRepository.flush();
        });

        customerRepository.delete(customer);
    }

    @Override
    public CustomerResponse getCustomerByUsername(String username) {

        User user = userRepository.findByUserName(username)
                .orElseThrow(() ->
                        new RuntimeException("User not found: " + username)
                );

        if (user.getCustomer() == null) {
            throw new RuntimeException("No customer linked to this user");
        }

        return mapToResponse(user.getCustomer());
    }

    private CustomerResponse mapToResponse(Customer customer) {

        CustomerResponse response = new CustomerResponse();

        response.setCustomerId(customer.getCustomerId());
        response.setFirstName(customer.getFirstName());
        response.setLastName(customer.getLastName());
        response.setEmail(customer.getEmail());
        response.setMobile(customer.getMobile());
        response.setAddress(customer.getAddress());
        response.setCreatedAt(customer.getCreatedAt());

        return response;
    }
}