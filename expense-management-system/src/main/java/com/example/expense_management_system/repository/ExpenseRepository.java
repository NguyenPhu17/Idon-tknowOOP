package com.example.expense_management_system.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.expense_management_system.model.Expense;

public interface ExpenseRepository extends JpaRepository<Expense, Integer> {
    List<Expense> findByUserId(int userId);

    @Query("SELECT i.type AS type, SUM(i.amount) AS totalAmount " +
            "FROM Expense i " +
            "WHERE i.userId = :userId " +
            "GROUP BY i.type")
    List<Object[]> findExpenseGroupedByType(Integer userId);
}