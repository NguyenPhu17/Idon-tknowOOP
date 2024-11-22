// src/components/DashboardPage.js
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import MyCalendar from '../Calendar';
import './DashboardPage.css';

const DashboardPage = ({ incomeList = [], expenseList = [] }) => {
    const [selectedDateTransactions, setSelectedDateTransactions] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);

    // Tính toán tổng thu nhập và chi tiêu
    const calculateStats = () => {
        const totalIncome = incomeList.reduce((sum, item) => sum + item.amount, 0);
        const totalExpense = expenseList.reduce((sum, item) => sum + item.amount, 0);
        return { totalIncome, totalExpense };
    };

    // Chuẩn bị dữ liệu cho biểu đồ
    const prepareChartData = () => {
        const allDates = [...new Set([...incomeList.map(i => i.date), ...expenseList.map(e => e.date)])].sort();
        return allDates.map(date => {
            const income = incomeList.filter(i => i.date === date).reduce((sum, i) => sum + i.amount, 0);
            const expense = expenseList.filter(e => e.date === date).reduce((sum, e) => sum + e.amount, 0);
            return { date, income, expense, balance: income - expense };
        });
    };

    const stats = calculateStats();
    const chartData = prepareChartData();

    // Tạo sự kiện cho lịch
    const events = chartData.map(data => ({
        title:  ` ${data.balance.toLocaleString()} VND`,
        start: new Date(data.date),
        end: new Date(data.date),
        allDay: true,
        color: data.balance >= 0 ? '#00DD00' : '#FF3300'
    }));

    // Hàm xử lý khi chọn ngày
    const handleSelectDate = (slotInfo) => {
        const selectedDateStr = new Date(slotInfo.start.getTime() - slotInfo.start.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 10);
        const transactionsForDate = [
            ...incomeList.filter(item => item.date === selectedDateStr),
            ...expenseList.filter(item => item.date === selectedDateStr),
        ];
        setSelectedDateTransactions(transactionsForDate);
        setSelectedDate(selectedDateStr);
    };

    const handleBackToCalendar = () => {
        setSelectedDate(null);
        setSelectedDateTransactions([]);
    };

    return (
        <div className="dashboard-container">
            {selectedDate ? (
                <div className="transactions-view">
                    <h3>Transactions for {selectedDate}</h3>
                    <button onClick={handleBackToCalendar} className="btn">Back to Calendar</button>
                    {selectedDateTransactions.length > 0 ? (
                        selectedDateTransactions.map(trans => (
                            <div key={trans.id} className="transaction-item">
                                <p><strong>Date:</strong> {trans.date}</p>
                                <p><strong>Description:</strong> {trans.title}</p>
                                <p><strong>Amount:</strong> {trans.amount.toLocaleString()} VND</p>
                                <p><strong>Category:</strong> {trans.type}</p>
                            </div>
                        ))
                    ) : (
                        <p>No transactions available for this date.</p>
                    )}
                </div>
            ) : (
                <div className="overview">
                    <h2>Financial Overview</h2>
                    {/* Thêm phần Card */}
                    <div className="stats-card-container">
                        <div className="card">
                            <h3>Total Income</h3>
                            <p className='color-income'>{stats.totalIncome.toLocaleString()} VND</p>
                        </div>
                        <div className="card">
                            <h3>Total Expenses</h3>
                            <p className='color-expense'>{stats.totalExpense.toLocaleString()} VND</p>
                        </div>
                        <div className="card">
                            <h3>Balance</h3>
                            <p className='color-balance'>{(stats.totalIncome - stats.totalExpense).toLocaleString()} VND</p>
                        </div>
                    </div>

                    <div className="line-chart-container">
                        <LineChart data={chartData} width={800} height={400} margin={{ top: 20, right: 30, left: 40, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis padding={{ left: 10, right: 10 }} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="income" stroke="#2ecc71" />
                            <Line type="monotone" dataKey="expense" stroke="#e74c3c" />
                        </LineChart>
                    </div>

                    <MyCalendar events={events} onSelectDate={handleSelectDate} />
                </div>
            )}
        </div>

    );
};

export default DashboardPage;
