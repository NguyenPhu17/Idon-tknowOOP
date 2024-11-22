import React, { useState, useContext, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { format } from 'date-fns';
import axios from 'axios';
import { UserContext } from '../../UserContext';
import MyCalendar from '../Calendar';
import './DashboardPage.css';

const DashboardPage = () => {
    const [incomeList, setIncomeList] = useState([]);
    const [expenseList, setExpenseList] = useState([]);
    const [selectedDateTransactions, setSelectedDateTransactions] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const expenseCategories = ['entertainment', 'investment', 'travel', 'shopping', 'food', 'transport', 'others'];
    const incomeCategories = ['salary', 'reward', 'invest', 'gift', 'subsidy', 'other'];

    const { user } = useContext(UserContext);
    const userId = user ? user.id : null;

    // Define the calculateStats function before it is used
    const calculateStats = () => {
        const totalIncome = incomeList.reduce((sum, item) => sum + item.amount, 0);
        const totalExpense = expenseList.reduce((sum, item) => sum + item.amount, 0);
        return { totalIncome, totalExpense };
    };

    // Fetch income and expense data
    useEffect(() => {
        const fetchFinancialData = async () => {
            if (userId) {
                try {
                    const incomeResponse = await axios.get(`http://localhost:8080/api/income/${userId}`);
                    const expenseResponse = await axios.get(`http://localhost:8080/api/expense/${userId}`);

                    // Normalize data
                    const normalizedIncome = incomeResponse.data.map(item => ({
                        ...item,
                        date: item.incomeDate || item.date // Prefer incomeDate if available
                    }));

                    const normalizedExpense = expenseResponse.data.map(item => ({
                        ...item,
                        date: item.expenseDate || item.date // Prefer expenseDate if available
                    }));

                    setIncomeList(normalizedIncome);
                    setExpenseList(normalizedExpense);
                } catch (error) {
                    console.error('Error fetching financial data:', error);
                }
            }
        };

        fetchFinancialData();
    }, [userId]);

    // Prepare data for the chart
    const prepareChartData = () => {
        const dataByDate = {};

        // Aggregate income
        incomeList.forEach(item => {
            const date = format(new Date(item.date), 'yyyy-MM-dd'); // Ensure consistent date format
            if (!dataByDate[date]) {
                dataByDate[date] = { date, income: 0, expense: 0 }; // Initialize if not yet
            }
            dataByDate[date].income += item.amount;
        });

        // Aggregate expense
        expenseList.forEach(item => {
            const date = format(new Date(item.date), 'yyyy-MM-dd'); // Ensure consistent date format
            if (!dataByDate[date]) {
                dataByDate[date] = { date, income: 0, expense: 0 }; // Initialize if not yet
            }
            dataByDate[date].expense += item.amount;
        });

        // Convert to array and sort by date
        const chartData = Object.values(dataByDate)
            .sort((a, b) => new Date(a.date) - new Date(b.date)) // Sort by date
            .map(item => ({
                ...item,
                displayDate: format(new Date(item.date), 'yy-MM-dd'), // Format date for display
                balance: item.income - item.expense
            }));

        return chartData;
    };

    const stats = calculateStats();
    const chartData = prepareChartData();

    // Generate events for the calendar
    const events = chartData.map(data => ({
        title: `${data.balance.toLocaleString()} VND`,
        start: new Date(data.date),
        end: new Date(data.date),
        allDay: true,
        color: data.balance >= 0 ? '#00DD00' : '#FF3300'
    }));

    // Handle date selection on the calendar
    // Hàm xử lý khi chọn ngày từ lịch
    const handleSelectDate = (slotInfo) => {
        // Đảm bảo ngày được chọn có định dạng 'YY-MM-DD'
        const selectedDateStr = format(new Date(slotInfo.start), 'yy-MM-dd'); // Định dạng ngày thành 'YY-MM-DD'

        const transactionsForDate = [
            ...incomeList.filter(item => format(new Date(item.date), 'yy-MM-dd') === selectedDateStr),
            ...expenseList.filter(item => format(new Date(item.date), 'yy-MM-dd') === selectedDateStr),
        ];

        setSelectedDateTransactions(transactionsForDate);
        setSelectedDate(selectedDateStr);
    };


    // Handle returning to the calendar view
    const handleBackToCalendar = () => {
        setSelectedDate(null);
        setSelectedDateTransactions([]);
    };

    return (
        <div className="dashboard-container">
            {selectedDate ? (
                <div className="transactions-view">
                    <h3>Giao dịch của ngày {selectedDate}</h3>
                    <button onClick={handleBackToCalendar} className="btn">Quay về</button>
                    {selectedDateTransactions.length > 0 ? (
                        selectedDateTransactions.map(trans => (
                            <div
                                key={trans.id}
                                className="transaction-item"
                                style={{
                                    borderColor: expenseCategories.includes(trans.type) ? '#FF3300' :
                                        incomeCategories.includes(trans.type) ? '#2ecc71' : '#ccc', // Kiểm tra danh mục chi tiêu hoặc thu nhập
                                    borderWidth: '2px',
                                    borderStyle: 'solid'
                                }}
                            >
                                <p><strong>Ngày:</strong> {format(new Date(trans.date), 'yy-MM-dd')}</p>
                                <p><strong>Nội dung:</strong> {trans.title}</p>
                                <p><strong>Số tiền:</strong> {trans.amount.toLocaleString()} VND</p>
                                <p><strong>Danh mục:</strong> {trans.type}</p>
                            </div>
                        ))
                    ) : (
                        <p>Không có giao dịch của ngày này.</p>
                    )}
                </div>

            ) : (
                <div className="overview">
                    <h2>Tổng quan</h2>
                    <div className="stats-card-container">
                        <div className="card">
                            <h3>Tổng Thu nhập</h3>
                            <p className='color-income'>{stats.totalIncome.toLocaleString()} VND</p>
                        </div>
                        <div className="card">
                            <h3>Tổng Chi tiêu</h3>
                            <p className='color-expense'>{stats.totalExpense.toLocaleString()} VND</p>
                        </div>
                        <div className="card">
                            <h3>Số dư</h3>
                            <p className='color-balance'>{(stats.totalIncome - stats.totalExpense).toLocaleString()} VND</p>
                        </div>
                    </div>

                    <div className="line-chart-container">
                        <LineChart data={chartData} width={800} height={400} margin={{ top: 20, right: 30, left: 40, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="displayDate" />
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
