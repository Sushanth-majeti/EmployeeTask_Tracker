package com.example.ems.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    @ManyToOne
    @JoinColumn(name = "recipient", nullable = false)
    private User recipient;

    @Column(nullable = false, length = 50)
    private String type;

    @Column(nullable = false)
    private LocalDate date;

    @Column(name = "is_read")
    private boolean read;
}
