package com.example.ems.controller;

import com.example.ems.entity.User;
import com.example.ems.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@Controller
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping({"/", "/login"})
    public String loginPage() {
        return "login";
    }

    @PostMapping("/login")
    public String doLogin(@RequestParam("user_name") String userName,
                          @RequestParam("password") String password,
                          HttpSession session,
                          Model model) {

        Optional<User> userOpt = userService.login(userName, password);

        if (userOpt.isEmpty()) {
            model.addAttribute("error", "Invalid username or password");
            return "login";
        }

        User user = userOpt.get();
        session.setAttribute("currentUser", user);

        if ("admin".equalsIgnoreCase(user.getRole())) {
            return "redirect:/dashboard";
        } else {
            return "redirect:/my-tasks";
        }
    }

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/login";
    }
}
