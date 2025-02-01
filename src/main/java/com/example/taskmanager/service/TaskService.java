package com.example.taskmanager.service;

import com.example.taskmanager.model.Task;
import com.example.taskmanager.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    // 获取所有任务
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    // 获取单个任务
    public Task getTaskById(Long id) {
        return taskRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Task createTask(@RequestBody Task task) {
        if (task.getDeadline() != null) {
             // 🔹 確保時間不含秒數
            task.setDeadline(task.getDeadline().withSecond(0).withNano(0));
        }
        return taskRepository.save(task);
    }

  
    // ✅ 更新任務（標題、描述、狀態、截止時間）
    public Task updateTask(Long id, Task taskDetails) {
        Optional<Task> taskOptional = taskRepository.findById(id);
        if (taskOptional.isPresent()) {
            Task task = taskOptional.get();

            // **確保不會覆蓋原本的標題與描述**
            if (taskDetails.getTitle() != null) task.setTitle(taskDetails.getTitle());
            if (taskDetails.getDescription() != null) task.setDescription(taskDetails.getDescription());

            // **更新任務狀態**
            task.setCompleted(taskDetails.isCompleted());

            // ✅ **更新截止時間**
            if (taskDetails.getDeadline() != null) task.setDeadline(taskDetails.getDeadline());

            return taskRepository.save(task);
        }
        return null; // 也可以改成拋出例外
    }
    

    // 删除任务
    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }
}
