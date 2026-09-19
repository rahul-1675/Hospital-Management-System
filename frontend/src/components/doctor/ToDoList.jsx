import React, { useState } from 'react';

const ToDoList = () => {
    const [tasks, setTasks] = useState([
        { id: 1, text: 'Review reports for John Doe', done: false },
        { id: 2, text: 'Staff meeting at 4 PM', done: true },
    ]);

    const toggleTask = (id) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
            <h3 className="text-xl font-bold mb-4">Doctor's To-Do List</h3>
            <ul className="space-y-2">
                {tasks.map(task => (
                    <li key={task.id} className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={task.done}
                            onChange={() => toggleTask(task.id)}
                            className="h-4 w-4 text-blue-600"
                        />
                        <span className={task.done ? "line-through text-gray-500" : "text-gray-800"}>
                            {task.text}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ToDoList;
