package com.riskmonitor.app.controller;

import com.riskmonitor.app.dto.AuthRequest;
import com.riskmonitor.app.dto.AuthResponse;
import com.riskmonitor.app.dto.RegisterRequest;
import com.riskmonitor.app.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = { "http://localhost:3000", "https://financial-risk-analyzer-barclay.vercel.app",
        "https://financial-risk-analyzer-b-git-9aff20-aryan-deshpande-s-projects.vercel.app",
        "https://financial-risk-analyzer-barclay-qdgbstce3.vercel.app" })
public class AuthController {

    @Autowired
    private AuthService authService;

    // ── POST /api/auth/register ──
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            String message = authService.register(request);
            return ResponseEntity.ok(Map.of("message", message));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ── POST /api/auth/login ──
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid username or password"));
        }
    }

    // ── GET /api/auth/test ── (quick health check)
    @GetMapping("/test")
    public ResponseEntity<?> test() {
        return ResponseEntity.ok(Map.of("status", "Backend is running!"));
    }
}