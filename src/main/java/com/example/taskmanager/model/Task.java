package com.example.taskmanager.model;

import jakarta.persistence.*;
import lombok.*;

@Entity  // 标记为 JPA 实体
@Table(name = "tasks")  // 指定数据库表名
@Getter @Setter  // Lombok 自动生成 Getter 和 Setter
@NoArgsConstructor @AllArgsConstructor // Lombok 生成无参 & 全参构造函数
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // 主键自增
    private Long id;

    @Column(nullable = false)  // 不能为空
    private String title;  // 任务标题

    private String description;  // 任务描述

    private boolean completed = false;  // 任务是否完成
}
