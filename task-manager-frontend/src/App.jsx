import { useState, useEffect } from "react";

function App() {
  const [tasks, setTasks] = useState([]); // 儲存任務列表
  const [newTask, setNewTask] = useState(""); // 儲存輸入的任務名稱

  // 🚀 當組件載入時，獲取任務列表
  useEffect(() => {
    fetch("http://localhost:8080/tasks")
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  // ✅ 新增任務
  const addTask = () => {
    if (newTask.trim() === "") {
      alert("請輸入任務名稱！");
      return;
    }

    const taskData = {
      title: newTask,
      description: "",
      completed: false,
    };

    fetch("http://localhost:8080/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    })
      .then((response) => response.json())
      .then((newTaskFromServer) => {
        setTasks([...tasks, newTaskFromServer]); // 更新前端的任務列表
        setNewTask(""); // 清空輸入框
      })
      .catch((error) => console.error("Error adding task:", error));
  };

  // 🗑️ **刪除任務**
  const deleteTask = (taskId) => {
    fetch(`http://localhost:8080/tasks/${taskId}`, {
      method: "DELETE",
    })
      .then(() => {
        // 從前端移除該任務
        setTasks(tasks.filter((task) => task.id !== taskId));
      })
      .catch((error) => console.error("Error deleting task:", error));
  };

  // ✅ **更新任務狀態**
  const completeTask = (taskId) => {
    fetch(`http://localhost:8080/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed: true }), // 設為已完成
    })
      .then((response) => response.json())
      .then((updatedTask) => {
        // 更新前端狀態
        setTasks(tasks.map((task) => (task.id === taskId ? updatedTask : task)));
      })
      .catch((error) => console.error("Error updating task:", error));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>📋 任務管理系統</h1>

      {/* 🔹 新增任務的輸入框與按鈕 */}
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="輸入新任務"
      />
      <button onClick={addTask}>新增任務</button>

      {/* 🔹 顯示任務列表 */}
      <ul>
        {tasks.length === 0 ? (
          <p>📌 沒有任務，請新增！</p>
        ) : (
          tasks.map((task) => (
            <li key={task.id}>
              <strong>{task.title}</strong> - {task.completed ? "✅ 已完成" : "❌ 未完成"}
              <button onClick={() => completeTask(task.id)} style={{ marginLeft: "10px" }}>
                ✅ 完成
              </button>
              <button onClick={() => deleteTask(task.id)} style={{ marginLeft: "10px" }}>
                🗑️ 刪除
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default App;
