package com.example.expense_management_system.service;

import com.example.expense_management_system.model.LimitExpense;
import com.example.expense_management_system.repository.LimitExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.List;

@Service
public class LimitExpenseService {

    @Autowired
    private LimitExpenseRepository limitExpenseRepository;

    public List<LimitExpense> getLimitExpensesByUserId(Long userId) {
        return limitExpenseRepository.findByUserId(userId);
    }

    // Thêm định mức chi tiêu
    public LimitExpense addLimitExpense(LimitExpense limitExpense) {
        return limitExpenseRepository.save(limitExpense);
    }

    // Cập nhật định mức chi tiêu
    public LimitExpense updateLimitExpense(Long id, LimitExpense updatedLimitExpense) {
        Optional<LimitExpense> existingLimitExpense = limitExpenseRepository.findById(id);
        if (existingLimitExpense.isPresent()) {
            LimitExpense limitExpense = existingLimitExpense.get();
            limitExpense.setUserId(updatedLimitExpense.getUserId());
            limitExpense.setMonth(updatedLimitExpense.getMonth());
            limitExpense.setLimitAmount(updatedLimitExpense.getLimitAmount());
            return limitExpenseRepository.save(limitExpense);
        }
        return null; // Nếu không tìm thấy định mức, trả về null
    }

    // Xóa định mức chi tiêu
    public boolean deleteLimitExpense(Long id) {
        Optional<LimitExpense> existingLimitExpense = limitExpenseRepository.findById(id);
        if (existingLimitExpense.isPresent()) {
            limitExpenseRepository.deleteById(id);
            return true;
        }
        return false; // Nếu không tìm thấy định mức, trả về false
    }
}
