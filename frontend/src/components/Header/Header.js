// src/Header.js
import React, { useContext } from 'react';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons'; // Import biểu tượng người dùng
import { Link } from 'react-router-dom'; // Nhập Link từ react-router-dom
import { UserContext } from '../../UserContext'; // Nhập UserContext

const Header = () => {
    const { user } = useContext(UserContext);

    return (
        <header className="header">
            <h1 className="logo">PNP Tracker</h1>
            <nav className="nav-center">
                <ul>
                    <li><Link to="/">Trang chủ</Link></li> {/* Sử dụng Link thay vì a */}
                    <li><Link to="/dashboard">Thống kê</Link></li>
                    <li><Link to="/income">Thu nhập</Link></li>
                    <li><Link to="/expense">Chi tiêu</Link></li>
                    <li><Link to="/limit">Định mức</Link></li>
                </ul>
            </nav>
            <div className="account">
                {user ? (
                    <span className="username">Hello, {user.username}</span> // Hiển thị username nếu đăng nhập
                ) : (
                    <Link to="/signin">
                        <FontAwesomeIcon
                            icon={faUserCircle}
                            className="avatar"
                            size="2x"
                        />
                    </Link>
                )}
            </div>
        </header>
    );
};


export default Header;