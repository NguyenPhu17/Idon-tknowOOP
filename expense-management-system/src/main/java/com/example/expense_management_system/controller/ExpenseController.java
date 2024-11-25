package com.example.expense_management_system.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.expense_management_system.model.Expense;
import com.example.expense_management_system.repository.ExpenseRepository;
import com.example.expense_management_system.service.ExpenseService;

@RestController
@RequestMapping("/api/expense")
public class ExpenseController {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private ExpenseService expenseService;

    // Tạo mới một chi tiêu
    @PostMapping("/add")
    public ResponseEntity<Expense> addExpense(@RequestBody Expense expense) {
        System.out.println("Dữ liệu nhận được từ frontend: " + expense); // Log dữ liệu nhận
        Expense savedExpense = expenseRepository.save(expense); // Lưu vào cơ sở dữ liệu
        System.out.println("ID thu nhập đã lưu: " + savedExpense.getId()); // Log ID sau khi lưu
        return ResponseEntity.status(201).body(savedExpense); // Trả lại đối tượng đã lưu
    }

    // Lấy danh sách chi tiêu của người dùng theo userId
    @GetMapping("/{userId}")
    public ResponseEntity<List<Expense>> getExpensesByUserId(@PathVariable Integer userId) {
        List<Expense> expenses = expenseRepository.findByUserId(userId);
        return ResponseEntity.ok(expenses);
    }

    // Xóa chi tiêu theo expenseId
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Integer id) {
        try {
            expenseRepository.deleteById(id); // Xóa thu nhập trong cơ sở dữ liệu
            return ResponseEntity.noContent().build(); // Trả về mã 204 khi xóa thành công
        } catch (Exception e) {
            return ResponseEntity.status(400).build(); // Trả về mã lỗi nếu không xóa được
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Expense> updateExpense(@PathVariable Integer id, @RequestBody Expense expenseDetails) {
        try {
            Expense updatedExpense = expenseService.updateExpense(id, expenseDetails); // Gọi service để sửa thu nhập
            return ResponseEntity.ok(updatedExpense); // Trả về thu nhập đã sửa
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(null); // Trả về lỗi nếu không tìm thấy thu nhập
        }
    }
}
