package com.example.expense_management_system.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "income") // Liên kết với bảng "income"
public class Income {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto Increment
    private Integer id;

    @Column(name = "user_id", nullable = false) // Cột "user_id"
    private Integer userId;

    @Column(nullable = false) // Cột "amount"
    private Double amount;

    @Column(nullable = false) // Cột "title"
    private String title;

    @Column(nullable = false) // Cột "type"
    private String type;

    @Column(columnDefinition = "TEXT") // Cột "reference"
    private String reference;

    @Column(name = "income_date", nullable = false) // Cột "income_date"
    private LocalDate incomeDate;

    // Constructor mặc định (bắt buộc)
    public Income() {}

    // Getters và Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getReference() {
        return reference;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public LocalDate getIncomeDate() {
        return incomeDate;
    }

    public void setIncomeDate(LocalDate incomeDate) {
        this.incomeDate = incomeDate;
    }
}
