import React, { useState, useContext, useEffect } from 'react';
import './LimitPage.css';
import { UserContext } from '../../UserContext'; // Nhập UserContext
import axios from 'axios';

const LimitPage = () => {
    const { user } = useContext(UserContext); // Lấy thông tin người dùng từ context
    const userId = user ? user.id : null; // Lấy userId từ thông tin người dùng

    const [limitList, setLimitList] = useState([]); // State để lưu danh sách định mức chi tiêu
    const [formData, setFormData] = useState({
        limitAmount: '',
        month: ''
    });
    const [editingLimit, setEditingLimit] = useState(null); // State để lưu định mức đang chỉnh sửa

    // Hàm để lấy dữ liệu định mức chi tiêu từ API
    useEffect(() => {
        const fetchData = async () => {
            if (userId) { // Kiểm tra xem người dùng đã đăng nhập chưa
                try {
                    const response = await axios.get(`http://localhost:8080/api/limit-expenses/${userId}`);
                    setLimitList(response.data); // Cập nhật danh sách định mức chi tiêu
                } catch (error) {
                    console.error('Error fetching limit expenses:', error);
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
        if (!formData.limitAmount || !formData.month || !userId) {
            console.error("Thiếu thông tin cần thiết hoặc chưa đăng nhập.");
            alert("Please fill out all fields and ensure you are logged in.");
            return;
        }

        const newLimitExpense = {
            ...formData,
            limitAmount: parseFloat(formData.limitAmount),
            userId: userId, // Lấy từ UserContext
        };

        try {
            if (editingLimit) {
                // Cập nhật định mức chi tiêu
                await axios.put(`http://localhost:8080/api/limit-expenses/${editingLimit.id}`, newLimitExpense);
                setLimitList((prevList) =>
                    prevList.map((limit) =>
                        limit.id === editingLimit.id ? { ...limit, ...newLimitExpense } : limit
                    )
                );
            } else {
                // Thêm định mức chi tiêu mới
                await axios.post(`http://localhost:8080/api/limit-expenses`, newLimitExpense);
                setLimitList((prevList) => [...prevList, newLimitExpense]);
            }

            setFormData({
                limitAmount: '',
                month: ''
            });
            setEditingLimit(null); // Reset lại trạng thái chỉnh sửa
        } catch (error) {
            console.error("Lỗi khi thêm/sửa định mức:", error.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            // Gọi API để xóa định mức chi tiêu từ backend
            await axios.delete(`http://localhost:8080/api/limit-expenses/${id}`);
            // Cập nhật lại danh sách định mức chi tiêu sau khi xóa
            setLimitList(prevList => prevList.filter(limit => limit.id !== id));
        } catch (error) {
            console.error('Lỗi khi xóa định mức:', error);
        }
    };

    const handleEdit = (limit) => {
        setEditingLimit(limit);
        setFormData({
            limitAmount: limit.limitAmount,
            month: limit.month
        });
    };

    return (
        <div className="app-container">
            <div className="expense-tracker">
                <div className="header-page">
                    Định Mức Chi Tiêu
                </div>

                <div className="content-container">
                    {/* Left Column - Form */}
                    <div className="form-container">
                        <input
                            type="number"
                            placeholder="Số tiền định mức"
                            name="limitAmount"
                            value={formData.limitAmount}
                            onChange={handleInputChange}
                            className="input-field"
                        />

                        <input
                            type="month"
                            name="month"
                            value={formData.month}
                            onChange={handleInputChange}
                            className="input-field"
                        />

                        <button className="add-limit-btn" onClick={handleSubmit}>
                            {editingLimit ? 'Cập nhật Định mức' : '+ Thêm Định mức'}
                        </button>
                    </div>

                    {/* Right Column - Limit List */}
                    <div className="limit-list-container">
                        <div className="limit-list">
                            {limitList.map((limit) => (
                                <div key={limit.id} className="limit-card">
                                    <div className="limit-card-content">
                                        <div className="limit-details">
                                            <h3 className="limit-title">{limit.month}</h3>
                                        </div>
                                        {/* Sử dụng toLocaleString() để hiển thị số tiền với dấu chấm phân cách */}
                                        <span className="limit-amount">
                                            {limit.limitAmount.toLocaleString()} VND
                                        </span>
                                        <div className="icon-container">
                                            <button
                                                className="edit-btn"
                                                onClick={() => handleEdit(limit)}
                                                title="Sửa định mức"
                                            >
                                                <span className="edit-icon"></span>
                                            </button>
                                            <button
                                                className="delete-btn"
                                                onClick={() => handleDelete(limit.id)}
                                                title="Xóa định mức"
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

export default LimitPage;
