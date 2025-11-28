package com.example.ems.repository;

import com.example.ems.entity.Notification;
import com.example.ems.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipientAndReadIsFalse(User recipient);
}
