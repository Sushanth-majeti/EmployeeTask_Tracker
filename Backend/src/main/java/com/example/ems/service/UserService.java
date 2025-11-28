package com.example.ems.service;

import com.example.ems.entity.User;
import com.example.ems.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository repo;

    public UserService(UserRepository repo) {
        this.repo = repo;
    }

    public Optional<User> login(String userName, String password) {
        return repo.findByUserName(userName)
                   .filter(u -> u.getPassword().equals(password));
    }

    public List<User> findAll() {
        return repo.findAll();
    }

    public List<User> findEmployees() {
        return repo.findAll().stream()
                .filter(u -> "employee".equalsIgnoreCase(u.getRole()))
                .toList();
    }

    public Optional<User> findById(Long id) {
        return repo.findById(id);
    }

    public User save(User user) {
        if (user.getCreatedAt() == null) {
            user.setCreatedAt(LocalDateTime.now());
        }
        return repo.save(user);
    }

    public void deleteById(Long id) {
        repo.deleteById(id);
    }
}
