package com.example.ems.controller;

import com.example.ems.entity.Task;
import com.example.ems.entity.User;
import com.example.ems.service.TaskService;
import com.example.ems.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.time.LocalDate;
import java.util.List;

@Controller
public class DashboardController {

    private final TaskService taskService;
    private final UserService userService;

    public DashboardController(TaskService taskService,
                               UserService userService) {
        this.taskService = taskService;
        this.userService = userService;
    }

    @GetMapping("/dashboard")
    public String dashboard(HttpSession session, Model model) {

        User current = (User) session.getAttribute("currentUser");
        if (current == null) return "redirect:/login";

        model.addAttribute("user", current);

        if ("admin".equalsIgnoreCase(current.getRole())) {
            List<Task> all = taskService.findAll();

            long totalUsers = userService.findAll().size();
            long totalTasks = all.size();
            long overdue = all.stream().filter(t ->
                    t.getDueDate() != null && t.getDueDate().isBefore(LocalDate.now())
            ).count();
            long noDeadline = all.stream().filter(t -> t.getDueDate() == null).count();
            long dueToday = all.stream().filter(t ->
                    LocalDate.now().equals(t.getDueDate())
            ).count();

            long pending = all.stream().filter(t -> "Pending".equalsIgnoreCase(t.getStatus())).count();
            long inProgress = all.stream().filter(t -> "In Progress".equalsIgnoreCase(t.getStatus())).count();
            long completed = all.stream().filter(t -> "Completed".equalsIgnoreCase(t.getStatus())).count();

            model.addAttribute("numUsers", totalUsers);
            model.addAttribute("numTasks", totalTasks);
            model.addAttribute("overdue", overdue);
            model.addAttribute("noDeadline", noDeadline);
            model.addAttribute("dueToday", dueToday);
            model.addAttribute("pending", pending);
            model.addAttribute("inProgress", inProgress);
            model.addAttribute("completed", completed);

        } else {
            List<Task> myTasks = taskService.findByAssignedTo(current);
            long total = myTasks.size();
            long overdue = myTasks.stream().filter(t ->
                    t.getDueDate() != null && t.getDueDate().isBefore(LocalDate.now())
            ).count();
            long noDeadline = myTasks.stream().filter(t -> t.getDueDate() == null).count();
            long dueToday = myTasks.stream().filter(t ->
                    LocalDate.now().equals(t.getDueDate())
            ).count();
            long pending = myTasks.stream().filter(t -> "Pending".equalsIgnoreCase(t.getStatus())).count();
            long inProgress = myTasks.stream().filter(t -> "In Progress".equalsIgnoreCase(t.getStatus())).count();
            long completed = myTasks.stream().filter(t -> "Completed".equalsIgnoreCase(t.getStatus())).count();

            model.addAttribute("numMyTasks", total);
            model.addAttribute("overdue", overdue);
            model.addAttribute("noDeadline", noDeadline);
            model.addAttribute("dueToday", dueToday);
            model.addAttribute("pending", pending);
            model.addAttribute("inProgress", inProgress);
            model.addAttribute("completed", completed);
        }

        return "dashboard";
    }
}
