package com.example.taskmanager.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.taskmanager.model.Subtask;

@Repository
public interface SubtaskRepository extends JpaRepository<Subtask, Long> {
}
