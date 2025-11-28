package com.example.ems.service;

import com.example.ems.entity.Task;
import com.example.ems.entity.User;
import com.example.ems.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    private final TaskRepository repo;

    public TaskService(TaskRepository repo) {
        this.repo = repo;
    }

    public List<Task> findAll() {
        return repo.findAll();
    }

    public Optional<Task> findById(Long id) {
        return repo.findById(id);
    }

    public List<Task> findByAssignedTo(User user) {
        return repo.findByAssignedTo(user);
    }

    public List<Task> dueToday() {
        return repo.findByDueDate(LocalDate.now());
    }

    public List<Task> overdue() {
        return repo.findByDueDateBefore(LocalDate.now());
    }

    public List<Task> noDeadline() {
        return repo.findByDueDateIsNull();
    }

    public Task save(Task task) {
        if (task.getCreatedAt() == null) {
            task.setCreatedAt(LocalDate.now());
        }
        if (task.getStatus() == null || task.getStatus().isBlank()) {
            task.setStatus("Pending");
        }
        return repo.save(task);
    }

    public void deleteById(Long id) {
        repo.deleteById(id);
    }
}
