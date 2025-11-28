package com.example.ems.repository;

import com.example.ems.entity.Task;
import com.example.ems.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByAssignedTo(User user);

    List<Task> findByDueDate(LocalDate date);

    List<Task> findByDueDateBefore(LocalDate date);

    List<Task> findByDueDateIsNull();
}
