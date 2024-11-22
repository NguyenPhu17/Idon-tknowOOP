package com.example.expense_management_system.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.expense_management_system.model.Expense;

public interface ExpenseRepository extends JpaRepository<Expense, Integer> {
    List<Expense> findByUserId(int userId);
    List<Expense> findByUserIdAndExpenseDateBetween(int userId, Date startDate, Date endDate);
}