package com.example.expense_management_system.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.expense_management_system.model.Expense;
import com.example.expense_management_system.repository.ExpenseRepository;
import com.example.expense_management_system.dto.ExpensePieChartDto;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    public Expense addExpense(Expense expense) {
        return expenseRepository.save(expense); // Lưu đối tượng expense vào cơ sở dữ liệu
    }

    public List<Expense> getExpensesByUser(int userId) {
        return expenseRepository.findByUserId(userId);
    }

    public void deleteExpense(int expenseId) {
        expenseRepository.deleteById(expenseId);
    }

    public Expense updateExpense(int expenseId, Expense expenseDetails) {
        // Tìm thu nhập theo ID
        Expense existingExpense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new RuntimeException("Expense not found with id " + expenseId));

        // Cập nhật các trường của thu nhập
        existingExpense.setTitle(expenseDetails.getTitle());
        existingExpense.setAmount(expenseDetails.getAmount());
        existingExpense.setExpenseDate(expenseDetails.getExpenseDate());
        existingExpense.setType(expenseDetails.getType());
        existingExpense.setReference(expenseDetails.getReference());

        // Lưu thu nhập đã được cập nhật
        return expenseRepository.save(existingExpense);
    }

    public List<ExpensePieChartDto> getExpensePieChartData(Integer userId) {
        List<Object[]> results = expenseRepository.findExpenseGroupedByType(userId);

        // Chuyển đổi từ Object[] thành ExpensePieChartDto
        return results.stream()
                .map(record -> new ExpensePieChartDto((String) record[0], (Double) record[1]))
                .toList();
    }
}
