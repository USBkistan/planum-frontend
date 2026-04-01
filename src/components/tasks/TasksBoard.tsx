import React from 'react';
import { type Comment } from './TaskDetailsPanel';
import './TasksBoard.css';

export interface Task {
    id: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    assignee?: string;
    status: 'todo' | 'in-progress' | 'done';
    comments: Comment[];
}

interface TasksBoardProps {
    tasks: Task[];
    onTaskMove?: (taskId: string, newStatus: Task['status']) => void;
    onTaskClick?: (task: Task) => void;
}

export const TasksBoard: React.FC<TasksBoardProps> = ({ tasks, onTaskMove, onTaskClick }) => {
    const columns: { id: Task['status']; title: string; color: string }[] = [
        { id: 'todo', title: 'Нужно сделать', color: '#ff6b6b' },
        { id: 'in-progress', title: 'В работе', color: '#feca57' },
        { id: 'done', title: 'Готово', color: '#1dd1a1' },
    ];

    const getTasksByStatus = (status: Task['status']) => tasks.filter(t => t.status === status);

    const getPriorityColor = (priority: Task['priority']) => {
        switch (priority) {
            case 'high': return '#ff4757';
            case 'medium': return '#ffa502';
            case 'low': return '#2ed573';
        }
    };

    const getPriorityLabel = (priority: Task['priority']) => {
        switch (priority) {
            case 'high': return 'Высокий';
            case 'medium': return 'Средний';
            case 'low': return 'Низкий';
        }
    };

    const handleDragStart = (e: React.DragEvent, taskId: string) => {
        e.dataTransfer.setData('taskId', taskId);
        e.dataTransfer.effectAllowed = 'move';
        const target = e.target as HTMLElement;
        setTimeout(() => {
            target.style.opacity = '0.5';
        }, 0);
    };

    const handleDragEnd = (e: React.DragEvent) => {
        const target = e.target as HTMLElement;
        target.style.opacity = '1';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent, status: Task['status']) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('taskId');
        if (taskId && onTaskMove) {
            onTaskMove(taskId, status);
        }
    };

    return (
        <div className="tasks-board">
            {columns.map(column => (
                <div
                    key={column.id}
                    className="tasks-board-column"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, column.id)}
                >
                    <div className="tasks-board-column-header" style={{ borderTopColor: column.color }}>
                        <h3 className="tasks-board-column-title">{column.title}</h3>
                        <span className="tasks-board-task-count">{getTasksByStatus(column.id).length}</span>
                    </div>
                    <div className="tasks-board-column-content">
                        {getTasksByStatus(column.id).map(task => (
                            <div
                                key={task.id}
                                className="tasks-board-task-card"
                                draggable
                                onDragStart={(e) => handleDragStart(e, task.id)}
                                onDragEnd={handleDragEnd}
                                onClick={() => onTaskClick?.(task)}
                            >
                                <div className="tasks-board-task-header">
                                    <span className="tasks-board-task-id">{task.id}</span>
                                    <span
                                        className="tasks-board-priority-badge"
                                        style={{ backgroundColor: getPriorityColor(task.priority) }}
                                    >
                                        {getPriorityLabel(task.priority)}
                                    </span>
                                </div>
                                <h4 className="tasks-board-task-title">{task.title}</h4>
                                <p className="tasks-board-task-description">{task.description}</p>
                                <div className="tasks-board-task-footer">
                                    {task.assignee && (
                                        <div className="tasks-board-assignee">
                                            <div className="tasks-board-avatar">{task.assignee.charAt(0).toUpperCase()}</div>
                                            <span className="tasks-board-assignee-name">{task.assignee}</span>
                                        </div>
                                    )}
                                    {task.comments.length > 0 && (
                                        <div className="tasks-board-comments-count">
                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginRight: '4px' }}>
                                                <path d="M2 10V4a2 2 0 012-2h6a2 2 0 012 2v4a2 2 0 01-2 2H8l-2 2-2-2H4a2 2 0 01-2-2z" stroke="#6c757d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            <span>{task.comments.length}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};
