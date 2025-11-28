package com.example.ems.controller;

import com.example.ems.entity.Notification;
import com.example.ems.entity.User;
import com.example.ems.service.NotificationService;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService service;

    public NotificationController(NotificationService service) {
        this.service = service;
    }

    @GetMapping
    public String notifications(HttpSession session, Model model) {
        User current = (User) session.getAttribute("currentUser");
        if (current == null) return "redirect:/login";

        List<Notification> list = service.unreadFor(current);
        model.addAttribute("notifications", list);
        model.addAttribute("user", current);
        return "notifications";
    }

    @PostMapping("/read/{id}")
    public String markRead(@PathVariable Long id) {
        service.markRead(id);
        return "redirect:/notifications";
    }
}
