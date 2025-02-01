import { useState, useEffect } from "react";

function App() {
  const [tasks, setTasks] = useState([]); // 儲存任務列表
  const [newTask, setNewTask] = useState(""); // 儲存輸入的任務名稱

  // 🚀 載入時從後端獲取任務
  useEffect(() => {
    fetch("http://localhost:8080/tasks")
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  // ✅ 新增任務
  const addTask = () => {
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
      .then((data) => {
        console.log("後端回應：", data);
        setTasks([...tasks, data]); 
        setNewTask("");
      })
      .catch((error) => console.error("Error adding task:", error));
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
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default App;
