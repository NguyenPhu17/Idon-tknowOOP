import React, { useState, useContext, useEffect } from 'react';
import './IncomePage.css';
import { UserContext } from '../../UserContext'; // Nhập UserContext
import axios from 'axios';

const IncomePage = ({ onAddIncome, onDeleteIncome }) => {
    const { user } = useContext(UserContext); // Lấy thông tin người dùng từ context
    const userId = user ? user.id : null; // Lấy userId từ thông tin người dùng
    console.log("Dữ liệu từ UserContext:", user);
    console.log("UserId:", userId);

    const [incomeList, setIncomeList] = useState([]); // State để lưu danh sách thu nhập
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        incomeDate: '',
        type: '',
        reference: ''
    });
    const [editingIncome, setEditingIncome] = useState(null); // State để lưu thu nhập đang được chỉnh sửa

    // Hàm để lấy dữ liệu thu nhập từ API
    useEffect(() => {
        const fetchData = async () => {
            if (userId) { // Kiểm tra xem người dùng đã đăng nhập chưa
                try {
                    const response = await axios.get(`http://localhost:8080/api/income/${userId}`);
                    console.log("Danh sách thu nhập từ API:", response.data); // Log dữ liệu từ backend
                    setIncomeList(response.data); // Cập nhật danh sách thu nhập
                } catch (error) {
                    console.error('Error fetching income data:', error);
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

        const newIncome = {
            ...formData,
            amount: parseFloat(formData.amount),
            userId: userId, // Lấy từ UserContext
        };

        console.log("Dữ liệu gửi đến API:", newIncome); // Log dữ liệu trước khi gửi

        try {
            if (editingIncome) {
                // Cập nhật thu nhập
                await axios.put(`http://localhost:8080/api/income/${editingIncome.id}`, newIncome);
                setIncomeList((prevList) =>
                    prevList.map((income) =>
                        income.id === editingIncome.id ? { ...income, ...newIncome } : income
                    )
                );
            } else {
                // Thêm thu nhập mới
                await onAddIncome(newIncome); // Gọi hàm thêm thu nhập từ props
                setIncomeList((prevList) => [...prevList, newIncome]);
            }

            setFormData({
                title: '',
                amount: '',
                incomeDate: '',
                type: '',
                reference: ''
            });
            setEditingIncome(null); // Reset lại trạng thái chỉnh sửa
        } catch (error) {
            console.error("Lỗi khi thêm/sửa thu nhập:", error.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            // Gọi API để xóa thu nhập từ backend
            await axios.delete(`http://localhost:8080/api/income/${id}`);
            // Cập nhật lại danh sách thu nhập sau khi xóa
            setIncomeList(prevList => prevList.filter(income => income.id !== id));
        } catch (error) {
            console.error('Lỗi khi xóa thu nhập:', error);
        }
    };

    const handleEdit = (income) => {
        setEditingIncome(income);
        setFormData({
            title: income.title,
            amount: income.amount,
            incomeDate: income.incomeDate,
            type: income.type,
            reference: income.reference
        });
    };

    return (
        <div className="app-container">
            <div className="income-tracker">
                <div className="total-income">
                    Tổng Thu nhập: <span className="amount">{incomeList.reduce((sum, income) => sum + income.amount, 0).toLocaleString()} VND</span>
                </div>

                <div className="content-container">
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
                            name="incomeDate"
                            value={formData.incomeDate}
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
                            <option value="salary">Lương</option>
                            <option value="reward">Thưởng</option>
                            <option value="invest">Đầu tư</option>
                            <option value="gift">Quà tặng</option>
                            <option value="subsidy">Trợ cấp</option>
                            <option value="other">Khác</option>
                        </select>

                        <textarea
                            placeholder="Ghi chú"
                            name="reference"
                            value={formData.reference}
                            onChange={handleInputChange}
                            className="input-field reference-field"
                        />

                        <button onClick={handleSubmit} className="add-income-btn">
                            {editingIncome ? 'Cập nhật thu nhập' : '+ Thêm Thu nhập'}
                        </button>
                    </div>

                    <div className="income-list-container">
                        <div className="income-list">
                            {incomeList.map((income, index) => (
                                <div key={income.id || index} className="income-card">
                                    <div className="income-card-content">
                                        <div className="income-details">
                                            <h3 className="income-title">{income.title}</h3>
                                            <p className="income-date">{new Date(income.incomeDate).toLocaleDateString()}</p>
                                            <p className="income-type">{income.type}</p>
                                            {income.reference && (
                                                <p className="income-reference">{income.reference}</p>
                                            )}
                                        </div>
                                        <span className="income-amount">
                                            {income.amount.toLocaleString()} VND
                                        </span>
                                        <div className="icon-container">
                                            <button
                                                className="edit-btn"
                                                onClick={() => handleEdit(income)}
                                                title="Edit income"
                                            >
                                                <span className="edit-icon"></span>
                                            </button>
                                            <button
                                                className="delete-btn"
                                                onClick={() => handleDelete(income.id)}
                                                title="Delete income"
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

export default IncomePage;
