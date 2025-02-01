package com.example.taskmanager.service;
import org.springframework.stereotype.Service;
import com.example.taskmanager.repository.SubtaskRepository;
import com.example.taskmanager.repository.TaskRepository;
import com.example.taskmanager.model.Task;
import com.example.taskmanager.model.Subtask;
import java.util.Optional;

@Service
public class SubtaskService {

    private final SubtaskRepository subtaskRepository;
    private final TaskRepository taskRepository;

    public SubtaskService(SubtaskRepository subtaskRepository, TaskRepository taskRepository) {
        this.subtaskRepository = subtaskRepository;
        this.taskRepository = taskRepository;
    }

     // ✅ 新增子任務
     public Task addSubtask(Long taskId, Subtask subtask) {
        Optional<Task> taskOptional = taskRepository.findById(taskId);
        if (taskOptional.isPresent()) {
            Task task = taskOptional.get();
            subtask.setParentTask(task);
            subtaskRepository.save(subtask);

            // 🔹 檢查所有子任務，如果全部完成，則標記父任務為完成
            task.checkCompletion();
            return taskRepository.save(task);
        }
        return null;
    }

    // ✅ 更新子任務狀態
    public Subtask updateSubtask(Long subtaskId, boolean completed) {
        Optional<Subtask> subtaskOptional = subtaskRepository.findById(subtaskId);
        if (subtaskOptional.isPresent()) {
            Subtask subtask = subtaskOptional.get();
            subtask.setCompleted(completed);
            subtaskRepository.save(subtask);

            // 🔹 當子任務完成時，重新檢查父任務狀態
            Task parentTask = subtask.getParentTask();
            parentTask.checkCompletion();
            taskRepository.save(parentTask);

            return subtask;
        }
        return null;
    }
}
