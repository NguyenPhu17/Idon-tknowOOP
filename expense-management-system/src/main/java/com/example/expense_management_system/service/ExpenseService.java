package com.example.expense_management_system.service;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.expense_management_system.model.Expense;
import com.example.expense_management_system.repository.ExpenseRepository;

@Service
public class ExpenseService {
    @Autowired
    private ExpenseRepository expenseRepository;

    public Expense addExpense(Expense expense) {
        expense.setCreatedAt(new Date());
        return expenseRepository.save(expense);
    }

    public List<Expense> getExpensesByUser(int userId) {
        return expenseRepository.findByUserId(userId);
    }

    public List<Expense> getExpensesByDateRange(int userId, Date startDate, Date endDate) {
        return expenseRepository.findByUserIdAndExpenseDateBetween(userId, startDate, endDate);
    }

    public void deleteExpense(int expenseId) {
        expenseRepository.deleteById(expenseId);
    }
}

