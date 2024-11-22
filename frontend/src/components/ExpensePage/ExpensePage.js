// src/components/ExpenseTracker.js
import React, { useState } from 'react';
import './ExpensePage.css'; // Import CSS cho giao diện

const ExpensePage = ({ expenseList, onAddExpense, onDeleteExpense }) => {
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        date: '',
        type: '',
        reference: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        if (!formData.title || !formData.amount) return;

        const newExpense = {
            ...formData,
            id: Date.now(),
            amount: parseFloat(formData.amount)
        };

        onAddExpense(newExpense); // Gọi hàm từ props để thêm chi tiêu
        setFormData({
            title: '',
            amount: '',
            date: '',
            type: '',
            reference: ''
        });
    };

    const handleDelete = (id) => {
        onDeleteExpense(id); // Gọi hàm từ props để xóa chi tiêu
    };

    return (
        <div className="app-container">
            <div className="expense-tracker">
                <div className="total-expense">
                    Total Expense: <span className="amount">{expenseList.reduce((sum, expense) => sum + expense.amount, 0).toLocaleString()} VND</span>
                </div>

                <div className="content-container">
                    {/* Left Column - Form */}
                    <div className="form-container">
                        <input
                            type="text"
                            placeholder="Expense Title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="input-field"
                        />

                        <input
                            type="number"
                            placeholder="Expense Amount"
                            name="amount"
                            value={formData.amount.toLocaleString()}
                            onChange={handleInputChange}
                            className="input-field"
                        />

                        <input
                            type="date"
                            placeholder="Enter A Date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            className="input-field"
                        />

                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                            className="input-field"
                        >
                            <option value="">--Select Option--</option>
                            <option value="salary">Salary</option>
                            <option value="entertainment">Entertainment</option>
                            <option value="investment">Investment</option>
                            <option value="travel">Travel</option>
                            <option value="shopping">Shopping</option>
                            <option value="food">Food</option>
                            <option value="other">Other</option>
                        </select>

                        <textarea
                            placeholder="Add A Reference"
                            name="reference"
                            value={formData.reference}
                            onChange={handleInputChange}
                            className="input-field reference-field"
                        />

                        <button
                            onClick={handleSubmit}
                            className="add-expense-btn"
                        >
                            + Add Expense
                        </button>
                    </div>

                    {/* Right Column - Income List */}
                    <div className="expense-list-container">
                        <div className="expense-list">
                            {expenseList.map(expense => (
                                <div key={expense.id} className="expense-card">
                                    <div className="expense-card-content">
                                        <div className="expense-details">
                                            <h3 className="expense-title">{expense.title}</h3>
                                            <p className="expense-date">{expense.date}</p>
                                            <p className="expense-type">{expense.type}</p>
                                            {expense.reference && (
                                                <p className="expense-reference">{expense.reference}</p>
                                            )}
                                        </div>
                                        <span className="expense-amount">
                                            {expense.amount.toLocaleString()} VND
                                        </span>
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDelete(expense.id, expense.amount)}
                                            title="Delete expense"
                                        >
                                            <span className="delete-icon"></span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExpensePage;