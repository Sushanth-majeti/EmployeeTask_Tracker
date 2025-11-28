package com.example.ems.service;

import com.example.ems.entity.Notification;
import com.example.ems.entity.User;
import com.example.ems.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository repo;

    public NotificationService(NotificationRepository repo) {
        this.repo = repo;
    }

    public List<Notification> unreadFor(User user) {
        return repo.findByRecipientAndReadIsFalse(user);
    }

    public Notification create(String msg, String type, User recipient) {
        Notification n = Notification.builder()
                .message(msg)
                .type(type)
                .recipient(recipient)
                .date(LocalDate.now())
                .read(false)
                .build();
        return repo.save(n);
    }

    public void markRead(Long id) {
        repo.findById(id).ifPresent(n -> {
            n.setRead(true);
            repo.save(n);
        });
    }
}
