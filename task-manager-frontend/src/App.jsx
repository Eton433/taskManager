import { useState, useEffect } from "react";

function App() {
  const [tasks, setTasks] = useState([]); // 儲存任務列表

  // 當組件載入時，向 Spring Boot API 獲取資料
  useEffect(() => {
    fetch("http://localhost:8080/tasks") // 你的 Spring Boot API
      .then((response) => response.json()) // 解析 JSON
      .then((data) => setTasks(data)) // 更新狀態
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>📋 任務管理系統</h1>
      <ul>
        {tasks.length === 0 ? (
          <p>📌 沒有任務，請新增！</p>
        ) : (
          tasks.map((task) => (
            <li key={task.id}>
              <strong>{task.title}</strong> - {task.completed ? "✅ 已完成" : "❌ 未完成"}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default App;
