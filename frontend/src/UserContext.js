import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Đọc thông tin người dùng từ Local Storage khi component được mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser)); // Thiết lập lại user từ localStorage
        }
    }, []);

    const handleLogin = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData)); // Lưu user vào localStorage
        setUser(userData); // Cập nhật state
    };

    const handleLogout = () => {
        localStorage.removeItem('user'); // Xóa user khỏi localStorage
        setUser(null); // Cập nhật state về null
    };

    return (
        <UserContext.Provider value={{ user, handleLogin, handleLogout }}>
            {children}
        </UserContext.Provider>
    );
};