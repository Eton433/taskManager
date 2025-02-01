import { useState, useEffect } from "react";

function App() {
  const [tasks, setTasks] = useState([]); // 儲存任務列表
  const [newTask, setNewTask] = useState(""); // 儲存輸入的任務名稱
  const [deadline, setDeadline] = useState(""); // ✅ 修正錯誤，新增 deadline 狀態
  const [newSubtask, setNewSubtask] = useState({}); // ✅ 確保 newSubtask 正確定義
  const [editingTask, setEditingTask] = useState(null); // 存儲正在編輯的任務 ID
  const [editTitle, setEditTitle] = useState(""); // 編輯中的標題
  const [editDescription, setEditDescription] = useState(""); // 編輯中的描述
  const [editDeadline, setEditDeadline] = useState(""); // 編輯中的截止時間
  const [editCompleted, setEditCompleted] = useState(false); // ✅ 存儲「編輯中的完成狀態」



  // 🚀 當組件載入時，獲取任務列表
  useEffect(() => {
    fetch("http://localhost:8080/tasks")
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  // ✅ 新增主任務
  const addTask = () => {
    if (newTask.trim() === "") {
      alert("請輸入任務名稱！");
      return;
    }

    fetch("http://localhost:8080/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTask, completed: false }),
    })
      .then((response) => response.json())
      .then((newTaskFromServer) => {
        setTasks([...tasks, newTaskFromServer]);
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
   // ✅ **新增子任務**
  const addSubtask = (taskId) => {
    if (!newSubtask[taskId] || newSubtask[taskId].trim() === "") {
      alert("請輸入子任務名稱！");
      return;
    }
  
    const subtaskData = { 
      title: newSubtask[taskId], 
      completed: false 
    };
  
    fetch(`http://localhost:8080/subtasks/${taskId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subtaskData), // ✅ 確保 JSON 格式正確
    })
      .then((response) => response.json())
      .then((updatedTask) => {
        setTasks(tasks.map((task) => 
          task.id === taskId ? updatedTask : task
        ));
        setNewSubtask({ ...newSubtask, [taskId]: "" }); // 清空輸入框
      })
      .catch((error) => console.error("Error adding subtask:", error));
  };
  const completeSubtask = (subtaskId, taskId) => {
    fetch(`http://localhost:8080/subtasks/${subtaskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: true }),
    })
      .then((response) => response.json())
      .then((updatedSubtask) => {
        setTasks(tasks.map((task) => {
          if (task.id === taskId) {
            return {
              ...task,
              subtasks: task.subtasks.map((subtask) =>
                subtask.id === subtaskId ? updatedSubtask : subtask
              ),
            };
          }
          return task;
        }));
      })
      .catch((error) => console.error("Error updating subtask:", error));
  };
  const updateTask = (taskId) => {
    fetch(`http://localhost:8080/tasks/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: editTitle,
        description: editDescription,
        completed: editCompleted,  // ✅ 新增狀態更新
        deadline: editDeadline ? `${editDeadline}:00` : null, // ✅ 確保時間格式正確
      }),
    })
      .then((response) => response.json())
      .then((updatedTask) => {
        setTasks(tasks.map((task) => (task.id === taskId ? updatedTask : task)));
        setEditingTask(null); // ✅ 結束編輯模式
      })
      .catch((error) => console.error("Error updating task:", error));
  };
  const editTask = (task) => {
    setEditingTask(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description || ""); // 避免 null
    setEditDeadline(task.deadline ? task.deadline.substring(0, 16) : ""); // 格式化日期
    setEditCompleted(task.completed); // ✅ 設定「編輯中的完成狀態」
  };
  

  return (
    <div style={{ padding: "20px" }}>
      <h1>📋 任務管理系統</h1>
  
      {/* 🔹 新增主任務 */}
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
            const isOverdue = task.deadline && new Date(task.deadline) < new Date();
  
            return (
              <li key={task.id} style={{ color: isOverdue ? "red" : "black", marginBottom: "20px" }}>
                {editingTask === task.id ? (
                  // 🔹 編輯模式
                  <div>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="編輯標題"
                    />
                    <input
                      type="text"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="編輯描述"
                    />
                    <input
                      type="datetime-local"
                      value={editDeadline}
                      onChange={(e) => setEditDeadline(e.target.value)}
                    />
                    <button onClick={() => updateTask(task.id)}>💾 儲存</button>
                    <button onClick={() => setEditingTask(null)}>❌ 取消</button>
                  </div>
                ) : (
                  // 🔹 一般模式
                  <div>
                    <strong>{task.title}</strong> - {task.completed ? "✅ 已完成" : "❌ 未完成"}
                    {task.description && `（${task.description}）`}
                    {task.deadline && `（截止時間：${task.deadline.substring(0, 16)}）`}
                    {isOverdue && " ⚠️ 已過期"}
                    <button onClick={() => completeTask(task.id)}>✅ 完成</button>
                    <button onClick={() => deleteTask(task.id)}>🗑️ 刪除</button>
                    <button onClick={() => editTask(task)}>✏️ 編輯</button>
                  </div>
                )}
  
                {/* 🔹 顯示子任務 */}
                <ul>
                  {task.subtasks && task.subtasks.length > 0 ? (
                    task.subtasks.map((subtask) => (
                      <li key={subtask.id} style={{ marginLeft: "20px" }}>
                        {subtask.title} - {subtask.completed ? "✅" : "❌"}
                        <button onClick={() => completeSubtask(subtask.id, task.id)}>✅ 完成</button>
                      </li>
                    ))
                  ) : (
                    <li style={{ marginLeft: "20px", color: "gray" }}>無子任務</li>
                  )}
                </ul>
  
                {/* 🔹 新增子任務 */}
                <input
                  type="text"
                  value={newSubtask[task.id] || ""}
                  onChange={(e) => setNewSubtask({ ...newSubtask, [task.id]: e.target.value })}
                  placeholder="輸入子任務"
                  style={{ marginLeft: "20px" }}
                />
                <button onClick={() => addSubtask(task.id)}>➕ 新增子任務</button>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
  export default App;