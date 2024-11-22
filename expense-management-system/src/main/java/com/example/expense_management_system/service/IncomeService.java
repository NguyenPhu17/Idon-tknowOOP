package com.example.expense_management_system.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.expense_management_system.model.Income;
import com.example.expense_management_system.repository.IncomeRepository;

@Service
public class IncomeService {

    @Autowired
    private IncomeRepository incomeRepository;

    public Income addIncome(Income income) {
        return incomeRepository.save(income);  // Lưu đối tượng income vào cơ sở dữ liệu
    }

    public List<Income> getIncomesByUser(int userId) {
        return incomeRepository.findByUserId(userId);
    }

    public void deleteIncome(int incomeId) {
        incomeRepository.deleteById(incomeId);
    }

    public Income updateIncome(int incomeId, Income incomeDetails) {
        // Tìm thu nhập theo ID
        Income existingIncome = incomeRepository.findById(incomeId)
                .orElseThrow(() -> new RuntimeException("Income not found with id " + incomeId));

        // Cập nhật các trường của thu nhập
        existingIncome.setTitle(incomeDetails.getTitle());
        existingIncome.setAmount(incomeDetails.getAmount());
        existingIncome.setIncomeDate(incomeDetails.getIncomeDate());
        existingIncome.setType(incomeDetails.getType());
        existingIncome.setReference(incomeDetails.getReference());

        // Lưu thu nhập đã được cập nhật
        return incomeRepository.save(existingIncome);
    }
}
