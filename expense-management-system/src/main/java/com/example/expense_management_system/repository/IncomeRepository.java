package com.example.expense_management_system.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.expense_management_system.model.Income;

public interface IncomeRepository extends JpaRepository<Income, Integer> {
    List<Income> findByUserId(Integer userId);

    @Query("SELECT i.type AS type, SUM(i.amount) AS totalAmount " +
           "FROM Income i " +
           "WHERE i.userId = :userId " +
           "GROUP BY i.type")
    List<Object[]> findIncomeGroupedByType(Integer userId);
}
