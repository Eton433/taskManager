package com.example.taskmanager.model;
import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "subtasks")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Subtask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private boolean completed;

    // ✅ 避免遞迴：標記 `parentTask` 為「被管理方」
    @ManyToOne
    @JoinColumn(name = "task_id", nullable = false)
    @JsonBackReference  
    private Task parentTask;
}
