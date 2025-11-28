package com.example.ems.controller;

import com.example.ems.entity.Task;
import com.example.ems.entity.User;
import com.example.ems.service.TaskService;
import com.example.ems.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@Controller
public class TaskController {

    private final TaskService taskService;
    private final UserService userService;

    public TaskController(TaskService taskService,
                          UserService userService) {
        this.taskService = taskService;
        this.userService = userService;
    }

    @GetMapping("/tasks")
    public String allTasks(@RequestParam(value = "due_date", required = false) String dueDateFilter,
                           HttpSession session,
                           Model model) {
        User current = (User) session.getAttribute("currentUser");
        if (current == null || !"admin".equalsIgnoreCase(current.getRole()))
            return "redirect:/login";

        String text = "All Task";
        List<Task> tasks;

        if ("Due Today".equalsIgnoreCase(dueDateFilter)) {
            text = "Due Today";
            tasks = taskService.dueToday();
        } else if ("Overdue".equalsIgnoreCase(dueDateFilter)) {
            text = "Overdue";
            tasks = taskService.overdue();
        } else if ("No Deadline".equalsIgnoreCase(dueDateFilter)) {
            text = "No Deadline";
            tasks = taskService.noDeadline();
        } else {
            tasks = taskService.findAll();
        }

        model.addAttribute("filterText", text);
        model.addAttribute("tasks", tasks);
        model.addAttribute("numTasks", tasks.size());
        model.addAttribute("users", userService.findEmployees());
        model.addAttribute("user", current);

        return "tasks";
    }

    @GetMapping("/tasks/new")
    public String newTaskForm(HttpSession session, Model model) {
        User current = (User) session.getAttribute("currentUser");
        if (current == null || !"admin".equalsIgnoreCase(current.getRole()))
            return "redirect:/login";

        model.addAttribute("task", new Task());
        model.addAttribute("employees", userService.findEmployees());
        model.addAttribute("user", current);
        return "task-form";
    }

    @PostMapping("/tasks/save")
    public String saveTask(@RequestParam(required = false) Long id,
                           @RequestParam String title,
                           @RequestParam(required = false) String description,
                           @RequestParam(required = false) Long assignedToId,
                           @RequestParam(required = false)
                           @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dueDate,
                           @RequestParam(defaultValue = "Pending") String status) {

        Task task = (id != null)
                ? taskService.findById(id).orElse(new Task())
                : new Task();

        task.setTitle(title);
        task.setDescription(description);
        task.setStatus(status);
        task.setDueDate(dueDate);

        if (assignedToId != null) {
            userService.findById(assignedToId).ifPresent(task::setAssignedTo);
        } else {
            task.setAssignedTo(null);
        }

        taskService.save(task);
        return "redirect:/tasks?success=Task%20saved%20successfully";
    }

    @GetMapping("/tasks/edit/{id}")
    public String editTask(@PathVariable Long id,
                           HttpSession session,
                           Model model) {
        User current = (User) session.getAttribute("currentUser");
        if (current == null || !"admin".equalsIgnoreCase(current.getRole()))
            return "redirect:/login";

        Task task = taskService.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        model.addAttribute("task", task);
        model.addAttribute("employees", userService.findEmployees());
        model.addAttribute("user", current);
        return "task-form";
    }

    @GetMapping("/tasks/delete/{id}")
    public String deleteTask(@PathVariable Long id,
                             HttpSession session) {
        User current = (User) session.getAttribute("currentUser");
        if (current == null || !"admin".equalsIgnoreCase(current.getRole()))
            return "redirect:/login";

        taskService.deleteById(id);
        return "redirect:/tasks?success=Task%20deleted";
    }

    @GetMapping("/my-tasks")
    public String myTasks(HttpSession session, Model model) {
        User current = (User) session.getAttribute("currentUser");
        if (current == null) return "redirect:/login";

        List<Task> tasks = taskService.findByAssignedTo(current);
        model.addAttribute("tasks", tasks);
        model.addAttribute("user", current);
        return "my-tasks";
    }
}
