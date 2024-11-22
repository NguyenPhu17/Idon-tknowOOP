package com.example.expense_management_system.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.expense_management_system.model.User;
import com.example.expense_management_system.service.UserService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    // Endpoint đăng ký
    @PostMapping("/register")
    public String registerUser(@RequestBody User user) {
        userService.registerUser(user);
        return "User registered successfully!";
    }

    // Endpoint đăng nhập
    @PostMapping("/login")
    public String loginUser(@RequestBody User user) {
        userService.login(user.getUsername(), user.getPassword());
        return "Login successful!";
    }
}
