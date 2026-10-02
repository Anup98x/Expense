import { useState } from "react";

function TaskInput() {
  // 1. Set up the state
  const [title, setTitle] = useState("");

  return (
    <div>
      {/* 2. The input value is tied to our 'title' state */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)} // 3. Update state as the user types
        placeholder="Enter task name..."
      />
      <p>You are typing: {title}</p>
    </div>
  );
}
