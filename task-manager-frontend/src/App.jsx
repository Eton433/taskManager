import { useState, useEffect } from "react";

function App() {
  const [tasks, setTasks] = useState([]); // 儲存任務列表
  const [newTask, setNewTask] = useState(""); // 儲存輸入的任務名稱
  const [deadline, setDeadline] = useState(""); // ✅ 修正錯誤，新增 deadline 狀態

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
      deadline: deadline ? `${deadline}:00` : null, // 🔹 確保傳給後端的格式是「YYYY-MM-DD HH:mm:00」
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
        setDeadline(""); // 清空截止日期
      })
      .catch((error) => console.error("Error adding task:", error));
  };

  // 🗑️ **刪除任務**
  const deleteTask = (taskId) => {
    fetch(`http://localhost:8080/tasks/${taskId}`, {
      method: "DELETE",
    })
      .then(() => {
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
      body: JSON.stringify({ completed: true }),
    })
      .then((response) => response.json())
      .then((updatedTask) => {
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
      <input
        type="datetime-local"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />
      <button onClick={addTask}>新增任務</button>

      {/* 🔹 顯示任務列表 */}
      <ul>
        {tasks.length === 0 ? (
          <p>📌 沒有任務，請新增！</p>
        ) : (
          tasks.map((task) => {
            const isOverdue =
              task.deadline && new Date(task.deadline) < new Date();

            return (
              <li key={task.id} style={{ color: isOverdue ? "red" : "black" }}>
                <strong>{task.title}</strong> - {task.completed ? "✅ 已完成" : "❌ 未完成"}
                {task.deadline && `（截止日期：${task.deadline.substring(0, 16)}）`}
                {isOverdue && " ⚠️ 已過期"}
                <button onClick={() => completeTask(task.id)} style={{ marginLeft: "10px" }}>
                  ✅ 完成
                </button>
                <button onClick={() => deleteTask(task.id)} style={{ marginLeft: "10px" }}>
                  🗑️ 刪除
                </button>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}

export default App;
