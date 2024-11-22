package com.example.expense_management_system.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.expense_management_system.model.User;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username); //kiem tra xem ten nguoi dung ton tai hay ko
    boolean existsByEmail(String email);
}


