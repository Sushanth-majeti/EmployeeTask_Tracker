package com.example.ems.controller;

import com.example.ems.entity.User;
import com.example.ems.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    private boolean isAdmin(HttpSession session) {
        User u = (User) session.getAttribute("currentUser");
        return u != null && "admin".equalsIgnoreCase(u.getRole());
    }

    @GetMapping
    public String listUsers(HttpSession session, Model model) {
        if (!isAdmin(session)) return "redirect:/login";

        model.addAttribute("users", userService.findAll());
        model.addAttribute("user", (User) session.getAttribute("currentUser"));
        return "users";
    }

    @GetMapping("/new")
    public String newUserForm(HttpSession session, Model model) {
        if (!isAdmin(session)) return "redirect:/login";

        model.addAttribute("userForm", new User());
        model.addAttribute("user", (User) session.getAttribute("currentUser"));
        return "user-form";
    }

    @PostMapping("/save")
    public String saveUser(@RequestParam(required = false) Long id,
                           @RequestParam("full_name") String fullName,
                           @RequestParam("user_name") String userName,
                           @RequestParam String password,
                           @RequestParam String role,
                           HttpSession session) {

        if (!isAdmin(session)) return "redirect:/login";

        User u = (id != null)
                ? userService.findById(id).orElse(new User())
                : new User();

        u.setFullName(fullName);
        u.setUserName(userName);
        u.setPassword(password);
        u.setRole(role);

        userService.save(u);
        return "redirect:/users?success=User%20saved";
    }

    @GetMapping("/edit/{id}")
    public String editUser(@PathVariable Long id,
                           HttpSession session,
                           Model model) {
        if (!isAdmin(session)) return "redirect:/login";

        User u = userService.findById(id).orElseThrow();
        model.addAttribute("userForm", u);
        model.addAttribute("user", (User) session.getAttribute("currentUser"));
        return "user-form";
    }

    @GetMapping("/delete/{id}")
    public String deleteUser(@PathVariable Long id,
                             HttpSession session) {
        if (!isAdmin(session)) return "redirect:/login";

        userService.deleteById(id);
        return "redirect:/users?success=User%20deleted";
    }
}
