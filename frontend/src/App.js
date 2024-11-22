import React, { useState } from 'react';
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
        console.log("Dữ liệu gửi đến API:", newIncome); // Log dữ liệu gửi
        try {
            const response = await axios.post('http://localhost:8080/api/income/add', newIncome);
            console.log("Phản hồi từ API:", response.data); // Log phản hồi từ backend
            setIncomeList((prevList) => [...prevList, response.data]); // Cập nhật incomeList
        } catch (error) {
            console.error("Lỗi khi thêm thu nhập:", error.response?.data || error.message);
        }
    };


    const handleDeleteIncome = async (id) => {
        await axios.delete(`http://localhost:8080/api/income/${id}`);
        setIncomeList(incomeList.filter(income => income.id !== id)); // Cập nhật lại incomeList
    };

    const handleAddExpense = async (newExpense) => {
        console.log("Dữ liệu gửi đến API:", newExpense); // Log dữ liệu gửi
        try {
            const response = await axios.post('http://localhost:8080/api/expense/add', newExpense);
            console.log("Phản hồi từ API:", response.data); // Log phản hồi từ backend
            setExpenseList((prevList) => [...prevList, response.data]); // Cập nhật expenseList
        } catch (error) {
            console.error("Lỗi khi thêm chi tiêu:", error.response?.data || error.message);
        }
    };

    const handleDeleteExpense = async (id) => {
        await axios.delete(`http://localhost:8080/api/expense/${id}`);
        setExpenseList(expenseList.filter(expense => expense.id !== id)); // Cập nhật lại expenseList
    };

    return (
        <UserProvider>
            <Router>
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/income" element={<IncomePage incomeList={incomeList} onAddIncome={handleAddIncome} onDeleteIncome={handleDeleteIncome} />} />
                    <Route path="/expense" element={<ExpensePage expenseList={expenseList} onAddExpense={handleAddExpense} onDeleteExpense={handleDeleteExpense} />} />
                    <Route path="/dashboard" element={<DashboardPage />} incomeList={incomeList} expenseList={expenseList} />
                    <Route path="/signin" element={<FormSignin />} />
                    <Route path="/signup" element={<FormSignup />} />
                    {/* Sử dụng Navigate để chuyển hướng */} 
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Router>
        </UserProvider>
    );
};

export default App;