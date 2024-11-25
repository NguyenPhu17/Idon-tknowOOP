package com.example.expense_management_system.model;

import jakarta.persistence.*;  // Thay 'javax.persistence' thành 'jakarta.persistence'
import java.math.BigDecimal;

@Entity
@Table(name = "limit_expense")
public class LimitExpense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "month", nullable = false)
    private String month;

    @Column(name = "limit_amount", nullable = false)
    private BigDecimal limitAmount;

    // Constructor mặc định
    public LimitExpense() {}

    // Constructor có tham số
    public LimitExpense(Long userId, String month, BigDecimal limitAmount) {
        this.userId = userId;
        this.month = month;
        this.limitAmount = limitAmount;
    }

    // Getters và Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public BigDecimal getLimitAmount() {
        return limitAmount;
    }

    public void setLimitAmount(BigDecimal limitAmount) {
        this.limitAmount = limitAmount;
    }
}
