package com.example.expense_management_system.service;

import java.util.Date;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.expense_management_system.model.User;
import com.example.expense_management_system.repository.UserRepository;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // Inject PasswordEncoder

    // Đăng ký người dùng
    public User registerUser(User user) {
        // Kiểm tra xem username hoặc email đã tồn tại chưa
        if (userRepository.existsByUsername(user.getUsername()) || userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Username or Email already exists!");
        }
        // Mã hóa mật khẩu trước khi lưu
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setCreatedAt(new Date());
        return userRepository.save(user);
    }

    // Đăng nhập
    public Optional<User> login(String username, String password) {
        // Tìm người dùng bằng username
        Optional<User> user = userRepository.findByUsername(username);

        // Kiểm tra mật khẩu thô với mật khẩu đã mã hóa
        if (user.isPresent() && passwordEncoder.matches(password, user.get().getPassword())) {
            return user;
        }

        throw new RuntimeException("Invalid credentials!");
    }
}
