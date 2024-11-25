package com.example.expense_management_system.dto;

public class IncomePieChartDto {
    private String type;
    private Double totalAmount;

    public IncomePieChartDto(String type, Double totalAmount) {
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
