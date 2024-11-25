package com.example.expense_management_system.dto;

public class ExpensePieChartDto {
    private String type;
    private Double totalAmount;

    public ExpensePieChartDto(String type, Double totalAmount) {
        this.type = type;
        this.totalAmount = totalAmount;
    }

    // Getters và Setters
    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }
}
