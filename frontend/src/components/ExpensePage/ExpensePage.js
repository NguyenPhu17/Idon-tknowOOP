import React, { useState, useContext, useEffect } from 'react';
import './ExpensePage.css'; // Import CSS cho giao diện
import { UserContext } from '../../UserContext'; // Nhập UserContext
import axios from 'axios';

const ExpensePage = ({ onAddExpense, onDeleteExpense }) => {
    const { user } = useContext(UserContext); // Lấy thông tin người dùng từ context
    const userId = user ? user.id : null; // Lấy userId từ thông tin người dùng
    console.log("Dữ liệu từ UserContext:", user);
    console.log("UserId:", userId);

    const [expenseList, setExpenseList] = useState([]); // State để lưu danh sách chi tiêu
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        expenseDate: '',
        type: '',
        reference: ''
    });
    const [editingExpense, setEditingExpense] = useState(null); // State để lưu thu nhập đang được chỉnh sửa


    // Hàm để lấy dữ liệu chi tiêu từ API
    useEffect(() => {
        const fetchData = async () => {
            if (userId) { // Kiểm tra xem người dùng đã đăng nhập chưa
                try {
                    const response = await axios.get(`http://localhost:8080/api/expense/${userId}`);
                    console.log("Danh sách chi tiêu từ API:", response.data); // Log dữ liệu từ backend
                    setExpenseList(response.data); // Cập nhật danh sách chi tiêu
                } catch (error) {
                    console.error('Error fetching expense data:', error);
                }
            }
        };
        fetchData();
    }, [userId]); // Chạy lại khi userId thay đổi

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        if (!formData.title || !formData.amount || !userId) {
            console.error("Thiếu thông tin cần thiết hoặc chưa đăng nhập.");
            alert("Please fill out all fields and ensure you are logged in.");
            return;
        }

        const newExpense = {
            ...formData,
            amount: parseFloat(formData.amount),
            userId: userId, // Lấy từ UserContext
        };

        console.log("Dữ liệu gửi đến API:", newExpense); // Log dữ liệu trước khi gửi

        try {
            if (editingExpense) {
                // Cập nhật chi tiêu
                await axios.put(`http://localhost:8080/api/expense/${editingExpense.id}`, newExpense);
                setExpenseList((prevList) =>
                    prevList.map((expense) =>
                        expense.id === editingExpense.id ? { ...expense, ...newExpense } : expense
                    )
                );
            } else {
                // Thêm chi tiêu mới
                await onAddExpense(newExpense); // Gọi hàm thêm chi tiêu từ props
                setExpenseList((prevList) => [...prevList, newExpense]);
            }

            setFormData({
                title: '',
                amount: '',
                expenseDate: '',
                type: '',
                reference: ''
            });
            setEditingExpense(null); // Reset lại trạng thái chỉnh sửa
        } catch (error) {
            console.error("Lỗi khi thêm chi tiêu:", error.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            // Gọi API để xóa chi tiêu từ backend
            await axios.delete(`http://localhost:8080/api/expense/${id}`);
            // Cập nhật lại danh sách chi tiêu sau khi xóa
            setExpenseList(prevList => prevList.filter(expense => expense.id !== id));
        } catch (error) {
            console.error('Lỗi khi xóa chi tiêu:', error);
        }
    };

    const handleEdit = (expense) => {
        setEditingExpense(expense);
        setFormData({
            title: expense.title,
            amount: expense.amount,
            expenseDate: expense.expenseDate,
            type: expense.type,
            reference: expense.reference
        });
    };

    return (
        <div className="app-container">
            <div className="expense-tracker">
                <div className="total-expense">
                    Tổng Chi tiêu: <span className="amount">{expenseList.reduce((sum, expense) => sum + expense.amount, 0).toLocaleString()} VND</span>
                </div>

                <div className="content-container">
                    {/* Left Column - Form */}
                    <div className="form-container">
                        <input
                            type="text"
                            placeholder="Nội dung"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="input-field"
                        />

                        <input
                            type="number"
                            placeholder="Số tiền"
                            name="amount"
                            value={formData.amount.toLocaleString()}
                            onChange={handleInputChange}
                            className="input-field"
                        />

                        <input
                            type="date"
                            placeholder="Enter A Date"
                            name="expenseDate"
                            value={formData.expenseDate}
                            onChange={handleInputChange}
                            className="input-field"
                        />

                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                            className="input-field"
                        >
                            <option value="">--Chọn--</option>
                            <option value="entertainment">Giải trí</option>
                            <option value="investment">Đầu tư</option>
                            <option value="travel">Du lịch</option>
                            <option value="shopping">Shopping</option>
                            <option value="food">Đồ ăn</option>
                            <option value="transport">Phương tiện</option>
                            <option value="others">Khác</option>
                        </select>

                        <textarea
                            placeholder="Ghi chú"
                            name="reference"
                            value={formData.reference}
                            onChange={handleInputChange}
                            className="input-field reference-field"
                        />

                        <button
                            onClick={handleSubmit}
                            className="add-expense-btn"
                        >
                            + Thêm Chi tiêu
                        </button>
                    </div>

                    {/* Right Column - Expense List */}
                    <div className="expense-list-container">
                        <div className="expense-list">
                            {expenseList.map(expense => (
                                <div key={expense.id} className="expense-card">
                                    <div className="expense-card-content">
                                        <div className="expense-details">
                                            <h3 className="expense-title">{expense.title}</h3>
                                            <p className="expense-date">{new Date(expense.expenseDate).toLocaleDateString()}</p>
                                            <p className="expense-type">{expense.type}</p>
                                            {expense.reference && (
                                                <p className="expense-reference">{expense.reference}</p>
                                            )}
                                        </div>
                                        <span className="expense-amount">
                                            {expense.amount.toLocaleString()} VND
                                        </span>
                                        <div className="icon-container">
                                            <button
                                                className="edit-btn"
                                                onClick={() => handleEdit(expense)}
                                                title="Edit expense"
                                            >
                                                <span className="edit-icon"></span>
                                            </button>
                                            <button
                                                className="delete-btn"
                                                onClick={() => handleDelete(expense.id)}
                                                title="Delete expense"
                                            >
                                                <span className="delete-icon"></span>
                                            </button>
                                        </div>
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