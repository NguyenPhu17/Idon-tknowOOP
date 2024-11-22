    import React, { useState, useContext, useEffect } from 'react';
    import './IncomePage.css';
    import { UserContext } from '../../UserContext'; // Nhập UserContext
    import axios from 'axios';

    const IncomePage = ({ onAddIncome, onDeleteIncome }) => {
        const { user } = useContext(UserContext); // Lấy thông tin người dùng từ context
        const userId = user ? user.id : null; // Lấy userId từ thông tin người dùng

        const [incomeList, setIncomeList] = useState([]); // State để lưu danh sách thu nhập
        const [formData, setFormData] = useState({
            title: '',
            amount: '',
            date: '',
            type: '',
            reference: ''
        });

        // Hàm để lấy dữ liệu thu nhập từ API
        useEffect(() => {
            const fetchData = async () => {
                if (userId) { // Kiểm tra xem người dùng đã đăng nhập chưa
                    try {
                        const response = await axios.get(`http://localhost:8080/api/income/${userId}`);
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
            if (!formData.title || !formData.amount || !userId) return; // Kiểm tra userId

            const newIncome = {
                ...formData,
                amount: parseFloat(formData.amount),
                userId: userId // Thêm userId vào đối tượng thu nhập
            };

            try {
                await onAddIncome(newIncome); // Gọi hàm từ props để thêm thu nhập
                setIncomeList(prevList => [...prevList, newIncome]); // Cập nhật incomeList sau khi thêm thu nhập
                setFormData({
                    title: '',
                    amount: '',
                    date: '',
                    type: '',
                    reference: ''
                });
            } catch (error) {
                console.error('Error adding income:', error);
            }
        };

        const handleDelete = async (id) => {
            await onDeleteIncome(id); // Gọi hàm từ props để xóa thu nhập
            setIncomeList(prevList => prevList.filter(income => income.id !== id)); // Cập nhật lại incomeList sau khi xóa
        };

        return (
            <div className="app-container">
                <div className="income-tracker">
                    <div className="total-income">
                        Total Income: <span className="amount">{incomeList.reduce((sum, income) => sum + income.amount, 0).toLocaleString()} VND</span>
                    </div>

                    <div className="content-container">
                        <div className="form-container">
                            <input
                                type="text"
                                placeholder="Income Title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="input-field"
                            />

                            <input
                                type="number"
                                placeholder="Income Amount"
                                name="amount"
                                value={formData.amount}
                                onChange={handleInputChange}
                                className="input-field"
                            />

                            <input
                                type="date"
                                placeholder="Enter A Date"
                                name="date"
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

                            <button onClick={handleSubmit} className="add-income-btn">
                                + Add Income
                            </button>
                        </div>

                        <div className="income-list-container">
                            <div className="income-list">
                                {incomeList.map(income => (
                                    <div key={income.id} className="income-card">
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
                                            <button
                                                className="delete-btn"
                                                onClick={() => handleDelete(income.id)}
                                                title="Delete income"
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

    export default IncomePage;