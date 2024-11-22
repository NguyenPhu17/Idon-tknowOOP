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
}
