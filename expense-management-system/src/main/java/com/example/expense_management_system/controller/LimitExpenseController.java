package com.example.expense_management_system.controller;

import com.example.expense_management_system.model.LimitExpense;
import com.example.expense_management_system.service.LimitExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/limit-expenses")
public class LimitExpenseController {

    @Autowired
    private LimitExpenseService limitExpenseService;

    @GetMapping("/{userId}")
    public ResponseEntity<List<LimitExpense>> getLimitExpensesByUserId(@PathVariable Long userId) {
        List<LimitExpense> limitExpenses = limitExpenseService.getLimitExpensesByUserId(userId);
        return ResponseEntity.ok(limitExpenses);
    }

    // Thêm định mức chi tiêu
    @PostMapping
    public ResponseEntity<LimitExpense> addLimitExpense(@RequestBody LimitExpense limitExpense) {
        LimitExpense createdLimitExpense = limitExpenseService.addLimitExpense(limitExpense);
        return new ResponseEntity<>(createdLimitExpense, HttpStatus.CREATED);
    }

    // Cập nhật định mức chi tiêu
    @PutMapping("/{id}")
    public ResponseEntity<LimitExpense> updateLimitExpense(@PathVariable Long id, @RequestBody LimitExpense limitExpense) {
        LimitExpense updatedLimitExpense = limitExpenseService.updateLimitExpense(id, limitExpense);
        if (updatedLimitExpense != null) {
            return new ResponseEntity<>(updatedLimitExpense, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND); // Nếu không tìm thấy định mức
    }

    // Xóa định mức chi tiêu
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLimitExpense(@PathVariable Long id) {
        boolean isDeleted = limitExpenseService.deleteLimitExpense(id);
        if (isDeleted) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); // Trả về mã 204 khi xóa thành công
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND); // Nếu không tìm thấy định mức
    }
}
