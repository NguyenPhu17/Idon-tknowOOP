import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './components/Home/Home';
import ExpensePage from './components/ExpensePage/ExpensePage';
import IncomePage from './components/IncomePage/IncomePage';
import DashboardPage from './components/DashboardPage/DashboardPage';
import FormSignin from './components/FormSignin/FormSignin';
import FormSignup from './components/FormSignup/FormSignup';
import axios from 'axios'; // Thêm thư viện Axios để gọi API
import './App.css';
import { UserProvider } from './UserContext'; // Nhập UserProvider

const App = () => {
    const [incomeList, setIncomeList] = useState([]);
    const [expenseList, setExpenseList] = useState([]);

    const handleAddIncome = async (newIncome) => {
        console.log("Sending to API:", newIncome); // Log thông tin trước khi gửi yêu cầu
        try {
            const response = await axios.post('http://localhost:8080/api/income/add', newIncome);
            console.log("Response from API:", response.data); // Log phản hồi từ API
            setIncomeList(prevList => [...prevList, response.data]); // Cập nhật incomeList
        } catch (error) {
            console.error('Error adding income:', error); // Log lỗi nếu có
        }
    };

    const handleDeleteIncome = async (id) => {
        await axios.delete(`http://localhost:8080/api/income/${id}`);
        setIncomeList(incomeList.filter(income => income.id !== id)); // Cập nhật lại incomeList
    };

    const handleAddExpense = async (newExpense) => {
        try {
            const response = await axios.post('http://localhost:8080/api/expenses', newExpense); // Gửi yêu cầu POST đến backend
            setExpenseList(prevList => [...prevList, response.data]); // Cập nhật danh sách chi tiêu với dữ liệu mới
        } catch (error) {
            console.error('Error adding expense:', error);
        }
    };

    const handleDeleteExpense = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/expenses/${id}`); // Gửi yêu cầu DELETE đến backend
            setExpenseList(prevList => prevList.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error deleting expense:', error);
        }
    };

    return (
        <UserProvider>
            <Router>
                <Header/>
                <Routes>
                    <Route path="/" element={<Home/>} />
                    <Route path="/income" element={<IncomePage incomeList={incomeList} onAddIncome={handleAddIncome} onDeleteIncome={handleDeleteIncome} />} />
                    <Route path="/expenses" element={<ExpensePage expenseList={expenseList} onAddExpense={handleAddExpense} onDeleteExpense={handleDeleteExpense} />} />
                    <Route path="/dashboard" element={<DashboardPage />} incomeList={incomeList} expenseList={expenseList}/>
                    <Route path="/signin" element={<FormSignin/>} />
                    <Route path="/signup" element={<FormSignup />} />
                    {/* Sử dụng Navigate để chuyển hướng */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Router>
        </UserProvider>
    );
};

export default App;