package com.example.expense_management_system.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.expense_management_system.model.Income;

public interface IncomeRepository extends JpaRepository<Income, Integer> {
    List<Income> findByUserId(int userId);
}
