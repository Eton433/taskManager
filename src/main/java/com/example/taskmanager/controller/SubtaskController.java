package com.example.taskmanager.controller;
import com.example.taskmanager.service.SubtaskService;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.example.taskmanager.model.Task;
import com.example.taskmanager.model.Subtask;

@RestController
@RequestMapping("/subtasks")
@CrossOrigin(origins = "http://localhost:5173")
public class SubtaskController {

    private final SubtaskService subtaskService;

    public SubtaskController(SubtaskService subtaskService) {
        this.subtaskService = subtaskService;
    }

    // ✅ 新增子任務，確保只回傳單一 `Task`
    @PostMapping("/{taskId}")
    public Task addSubtask(@PathVariable Long taskId, @RequestBody Subtask subtask) {
        Task updatedTask = subtaskService.addSubtask(taskId, subtask);
        if (updatedTask != null) {
            return updatedTask;  // ✅ 回傳正確格式的 `Task`
        }
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "任務不存在");
    }

    // ✅ 更新子任務狀態
    @PutMapping("/{subtaskId}")
    public Subtask updateSubtask(@PathVariable Long subtaskId, @RequestBody Subtask subtaskDetails) {
        return subtaskService.updateSubtask(subtaskId, subtaskDetails.isCompleted());
    }
}
