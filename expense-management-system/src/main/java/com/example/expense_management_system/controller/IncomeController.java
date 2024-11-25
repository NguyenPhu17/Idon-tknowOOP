package com.example.expense_management_system.controller;

import java.util.List; // Import cho List
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

import com.example.expense_management_system.dto.IncomePieChartDto;
import com.example.expense_management_system.model.Income;
import com.example.expense_management_system.repository.IncomeRepository;
import com.example.expense_management_system.service.IncomeService;

@RestController
@RequestMapping("/api/income")
public class IncomeController {

    @Autowired
    private IncomeRepository incomeRepository;

    @Autowired
    private IncomeService incomeService;

    // Tạo mới một thu nhập
    @PostMapping("/add")
    public ResponseEntity<Income> addIncome(@RequestBody Income income) {
        System.out.println("Dữ liệu nhận được từ frontend: " + income); // Log dữ liệu nhận
        Income savedIncome = incomeRepository.save(income); // Lưu vào cơ sở dữ liệu
        System.out.println("ID thu nhập đã lưu: " + savedIncome.getId()); // Log ID sau khi lưu
        return ResponseEntity.status(201).body(savedIncome); // Trả lại đối tượng đã lưu
    }

    // Lấy tất cả các bản ghi thu nhập
    @GetMapping("/{userId}")
    public ResponseEntity<List<Income>> getIncomesByUserId(@PathVariable Integer userId) {
        List<Income> incomes = incomeRepository.findByUserId(userId);
        return ResponseEntity.ok(incomes);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIncome(@PathVariable Integer id) {
        try {
            incomeRepository.deleteById(id); // Xóa thu nhập trong cơ sở dữ liệu
            return ResponseEntity.noContent().build(); // Trả về mã 204 khi xóa thành công
        } catch (Exception e) {
            return ResponseEntity.status(400).build(); // Trả về mã lỗi nếu không xóa được
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Income> updateIncome(@PathVariable Integer id, @RequestBody Income incomeDetails) {
        try {
            Income updatedIncome = incomeService.updateIncome(id, incomeDetails); // Gọi service để sửa thu nhập
            return ResponseEntity.ok(updatedIncome); // Trả về thu nhập đã sửa
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(null); // Trả về lỗi nếu không tìm thấy thu nhập
        }
    }

    @GetMapping("/chart/{userId}")
    public ResponseEntity<List<IncomePieChartDto>> getIncomePieChart(@PathVariable Integer userId) {
        List<IncomePieChartDto> pieChartData = incomeService.getIncomePieChartData(userId);
        return ResponseEntity.ok(pieChartData);
    }
}
