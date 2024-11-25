package com.example.expense_management_system.repository;

import com.example.expense_management_system.model.LimitExpense;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LimitExpenseRepository extends JpaRepository<LimitExpense, Long> {

    List<LimitExpense> findByUserId(Long userId);

    // Bạn cũng có thể thêm các phương thức khác nếu cần.
}
