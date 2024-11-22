package com.example.expense_management_system.controller;

import java.util.List; // Import cho List
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.expense_management_system.model.Income;
import com.example.expense_management_system.repository.IncomeRepository;

@RestController
@RequestMapping("/api/income")
public class IncomeController {

    @Autowired
    private IncomeRepository incomeRepository;

    // Tạo mới một thu nhập
    @PostMapping("/add")
    public ResponseEntity<Income> addIncome(@RequestBody Income income) {
        if (income.getUserId() == null) {
            return ResponseEntity.badRequest().build(); // Trả về lỗi nếu userId không hợp lệ
        }
        Income savedIncome = incomeRepository.save(income);
        return ResponseEntity.status(201).body(savedIncome); // Trả về đối tượng Income đã được tạo mới
    }

    // Lấy tất cả các bản ghi thu nhập
    @GetMapping("/{userId}")
    public ResponseEntity<List<Income>> getIncomesByUserId(@PathVariable Integer userId) {
        List<Income> incomes = incomeRepository.findByUserId(userId);
        return ResponseEntity.ok(incomes);
    }
}
