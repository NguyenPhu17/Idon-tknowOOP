import React, { useState, useContext, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { PieChart, Pie, Cell, Tooltip as PieTooltip } from 'recharts'; // Import thêm các thành phần Pie
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
    const [currentMonth, setCurrentMonth] = useState(new Date()); // Theo dõi tháng hiện tại

    const expenseCategories = ['entertainment', 'investment', 'travel', 'shopping', 'food', 'transport', 'others'];
    const incomeCategories = ['salary', 'reward', 'invest', 'gift', 'subsidy', 'other'];

    const { user } = useContext(UserContext);
    const userId = user ? user.id : null;

    // Hàm tính tổng thu nhập và chi tiêu toàn cục
    const calculateStats = () => {
        const totalIncome = incomeList.reduce((sum, item) => sum + item.amount, 0);
        const totalExpense = expenseList.reduce((sum, item) => sum + item.amount, 0);
        return { totalIncome, totalExpense };
    };

    // Hàm tính tổng thu nhập và chi tiêu trong tháng hiện tại
    const calculateMonthlyStats = () => {
        const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

        const monthlyIncome = incomeList
            .filter(item => new Date(item.date) >= startOfMonth && new Date(item.date) <= endOfMonth)
            .reduce((sum, item) => sum + item.amount, 0);

        const monthlyExpense = expenseList
            .filter(item => new Date(item.date) >= startOfMonth && new Date(item.date) <= endOfMonth)
            .reduce((sum, item) => sum + item.amount, 0);

        return { monthlyIncome, monthlyExpense };
    };

    // Fetch dữ liệu thu nhập và chi tiêu
    useEffect(() => {
        const fetchFinancialData = async () => {
            if (userId) {
                try {
                    const incomeResponse = await axios.get(`http://localhost:8080/api/income/${userId}`);
                    const expenseResponse = await axios.get(`http://localhost:8080/api/expense/${userId}`);

                    // Chuẩn hóa dữ liệu
                    const normalizedIncome = incomeResponse.data.map(item => ({
                        ...item,
                        date: item.incomeDate || item.date
                    }));

                    const normalizedExpense = expenseResponse.data.map(item => ({
                        ...item,
                        date: item.expenseDate || item.date
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

    // Chuẩn bị dữ liệu cho biểu đồ
    const prepareChartData = () => {
        const dataByDate = {};

        incomeList.forEach(item => {
            const date = format(new Date(item.date), 'yyyy-MM-dd');
            if (!dataByDate[date]) {
                dataByDate[date] = { date, income: 0, expense: 0 };
            }
            dataByDate[date].income += item.amount;
        });

        expenseList.forEach(item => {
            const date = format(new Date(item.date), 'yyyy-MM-dd');
            if (!dataByDate[date]) {
                dataByDate[date] = { date, income: 0, expense: 0 };
            }
            dataByDate[date].expense += item.amount;
        });

        return Object.values(dataByDate)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map(item => ({
                ...item,
                displayDate: format(new Date(item.date), 'yy-MM-dd'),
                balance: item.income - item.expense
            }));
    };

    const stats = calculateStats();
    const { monthlyIncome, monthlyExpense } = calculateMonthlyStats();
    const chartData = prepareChartData();

    const incomeByCategory = incomeCategories.map(category => {
        const categoryIncome = incomeList.filter(item => item.type === category).reduce((sum, item) => sum + item.amount, 0);
        return { name: category, value: categoryIncome };
    });

    const colorIncome = {
        salary: '#00DD00',  // Màu xanh lá cho lương
        reward: '#FFD700',  // Màu vàng cho thưởng
        invest: '#1E90FF',  // Màu xanh dương cho đầu tư
        gift: '#FF69B4',    // Màu hồng cho quà tặng
        subsidy: '#8A2BE2', // Màu tím cho trợ cấp
        other: '#D3D3D3'    // Màu xám cho khác
    };

    const expenseByCategory = expenseCategories.map(category => {
        const categoryExpense = expenseList.filter(item => item.type === category).reduce((sum, item) => sum + item.amount, 0);
        return { name: category, value: categoryExpense };
    });

    const colorExpense = {
        entertainment: '#FF5733',  // Màu đỏ cho giải trí
        investment: '#1E90FF',     // Màu xanh dương cho đầu tư
        travel: '#FFA500',         // Màu cam cho du lịch
        shopping: '#FF69B4',       // Màu hồng cho mua sắm
        food: '#32CD32',           // Màu xanh lá cho thực phẩm
        transport: '#FFD700',      // Màu vàng cho phương tiện
        others: '#D3D3D3'          // Màu xám cho khác
    };

    // Tạo sự kiện cho lịch
    const events = chartData.map(data => ({
        title: `${data.balance.toLocaleString()} VND`,
        start: new Date(data.date),
        end: new Date(data.date),
        allDay: true,
        color: data.balance >= 0 ? '#00DD00' : '#FF3300'
    }));

    // Xử lý khi chọn ngày trên lịch
    const handleSelectDate = (slotInfo) => {
        const selectedDateStr = format(new Date(slotInfo.start), 'yy-MM-dd');

        const transactionsForDate = [
            ...incomeList.filter(item => format(new Date(item.date), 'yy-MM-dd') === selectedDateStr),
            ...expenseList.filter(item => format(new Date(item.date), 'yy-MM-dd') === selectedDateStr),
        ];

        setSelectedDateTransactions(transactionsForDate);
        setSelectedDate(selectedDateStr);
    };

    // Xử lý khi chuyển tháng trên lịch
    const handleMonthChange = (date) => {
        setCurrentMonth(date);
    };

    // Xử lý quay lại lịch
    const handleBackToCalendar = () => {
        setSelectedDate(null);
        setSelectedDateTransactions([]);
    };

    const [monthlyLimit, setMonthlyLimit] = useState(null); // Định mức chi tiêu tháng
    const [progressPercentage, setProgressPercentage] = useState(0); // Phần trăm chi tiêu

    useEffect(() => {
        const fetchMonthlyLimit = async () => {
            if (userId) {
                try {
                    const response = await axios.get(`http://localhost:8080/api/limit-expenses/${userId}`);
                    const limits = response.data;

                    // Lấy định mức của tháng hiện tại
                    const currentMonthStr = format(currentMonth, 'yyyy-MM');
                    const limitForMonth = limits.find(limit => limit.month === currentMonthStr);

                    if (limitForMonth) {
                        setMonthlyLimit(limitForMonth.limitAmount);

                        // Tính phần trăm chi tiêu
                        const percentage = (monthlyExpense / limitForMonth.limitAmount) * 100;
                        setProgressPercentage(Math.min(percentage, 100)); // Giới hạn tối đa là 100%
                        if (percentage > 100) {
                            alert('CẢNH BÁO: Bạn đã vượt định mức chi tiêu tháng này!');
                        }
                    } else {
                        setMonthlyLimit(null);
                        setProgressPercentage(0);
                    }
                } catch (error) {
                    console.error("Error fetching monthly limit:", error);
                }
            }
        };

        fetchMonthlyLimit();
    }, [userId, currentMonth, monthlyExpense]); // Chạy lại khi userId, tháng hiện tại, hoặc tổng chi tiêu thay đổi

    return (
        <div className="dashboard-container">
            {selectedDate ? (
                <div className="transactions-view">
                    <h3>Giao dịch của ngày {selectedDate}</h3>
                    <button onClick={handleBackToCalendar} className="btn">Quay về</button>
                    {selectedDateTransactions.length > 0 ? (
                        selectedDateTransactions.map(trans => (
                            <div
                                key={trans.id}
                                className="transaction-item"
                                style={{
                                    borderColor: expenseCategories.includes(trans.type) ? '#FF3300' :
                                        incomeCategories.includes(trans.type) ? '#2ecc71' : '#ccc',
                                    borderWidth: '2px',
                                    borderStyle: 'solid'
                                }}
                            >
                                <p><strong>Ngày:</strong> {format(new Date(trans.date), 'yy-MM-dd')}</p>
                                <p><strong>Nội dung:</strong> {trans.title}</p>
                                <p><strong>Số tiền:</strong> {trans.amount.toLocaleString()} VND</p>
                                <p><strong>Danh mục:</strong> {trans.type}</p>
                            </div>
                        ))
                    ) : (
                        <p>Không có giao dịch của ngày này.</p>
                    )}
                </div>
            ) : (
                <div className="overview">
                    <h2>Tổng quan</h2>
                    <div className="stats-card-container">
                        <div className="card">
                            <h3>Tổng Thu nhập</h3>
                            <p className='color-income'>{stats.totalIncome.toLocaleString()} VND</p>
                        </div>
                        <div className="card">
                            <h3>Tổng Chi tiêu</h3>
                            <p className='color-expense'>{stats.totalExpense.toLocaleString()} VND</p>
                        </div>
                        <div className="card">
                            <h3>Số dư</h3>
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

                    <div className="pie-charts-container">
                        <div className="pie-chart-wrapper">
                            <PieChart width={300} height={300}>
                                <Pie
                                    data={incomeByCategory}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%" cy="50%" outerRadius={150} fill="#8884d8"
                                    labelLine={false}
                                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`} // Hiển thị phần trăm
                                >
                                    {incomeByCategory.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={colorIncome[entry.name]} />
                                    ))}
                                </Pie>
                                <PieTooltip />
                            </PieChart>
                        </div>

                        <div className="pie-chart-wrapper">
                            <PieChart width={300} height={300}>
                                <Pie
                                    data={expenseByCategory}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%" cy="50%" outerRadius={150} fill="#8884d8"
                                    labelLine={false}
                                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`} // Hiển thị phần trăm
                                >
                                    {expenseByCategory.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={colorExpense[entry.name]} />
                                    ))}
                                </Pie>
                                <PieTooltip />
                            </PieChart>
                        </div>
                    </div>


                    <MyCalendar
                        events={events}
                        onSelectDate={handleSelectDate}
                        onNavigate={handleMonthChange} // Xử lý thay đổi tháng
                    />
                    <div className="monthly-stats">
                        <h3>Tổng thu nhập tháng: <span className="color-income">{monthlyIncome.toLocaleString()} VND</span></h3>
                        <h3>Tổng chi tiêu tháng: <span className="color-expense">{monthlyExpense.toLocaleString()} VND</span></h3>
                        {/* Progress Bar - Hiển thị định mức và tiến độ */}
                        {monthlyLimit !== null && (
                            <div className="progress-bar-container">
                                <h3>Định mức chi tiêu tháng: <span>{monthlyLimit.toLocaleString()} VND</span></h3>
                                <div className="progress-bar">
                                    <div
                                        className="progress-bar-fill"
                                        style={{
                                            width: `${progressPercentage}%`,
                                            backgroundColor: progressPercentage >= 100 ? '#e74c3c' : '#2ecc71',
                                        }}
                                    >
                                        {progressPercentage.toFixed(1)}%
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;