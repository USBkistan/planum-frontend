import React from 'react';
import { type Task } from './TasksBoard';
import './TaskDetailsPanel.css';

export interface Comment {
    id: string;
    author: string;
    text: string;
    createdAt: Date;
}

export interface TaskWithComments extends Task {
    comments: Comment[];
}

interface TaskDetailsPanelProps {
    task: TaskWithComments | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (task: TaskWithComments) => void;
    onDelete: (taskId: string) => void;
    onAddComment: (taskId: string, text: string) => void;
    currentUser: string | undefined;
    availableUsers: string[];
}

export const TaskDetailsPanel: React.FC<TaskDetailsPanelProps> = ({
    task,
    isOpen,
    onClose,
    onUpdate,
    onDelete,
    onAddComment,
    currentUser,
    availableUsers,
}) => {
    const [commentText, setCommentText] = React.useState('');

    if (!task) return null;

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

    const handleStatusChange = (newStatus: Task['status']) => {
        onUpdate({ ...task, status: newStatus });
    };

    const handlePriorityChange = (newPriority: Task['priority']) => {
        onUpdate({ ...task, priority: newPriority });
    };

    const handleAssigneeChange = (newAssignee: string) => {
        onUpdate({ ...task, assignee: newAssignee || undefined });
    };

    const handleTakeTask = () => {
        if (currentUser) {
            onUpdate({ ...task, assignee: currentUser });
        }
    };

    const handleAddComment = () => {
        if (commentText.trim() && currentUser) {
            onAddComment(task.id, commentText.trim());
            setCommentText('');
        }
    };

    const handleDelete = () => {
        if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
            onDelete(task.id);
        }
    };

    return (
        <>
            <div className="task-panel-overlay" onClick={onClose} />
            <div className="task-panel" style={{ transform: isOpen ? 'translateX(0)' : 'translateX(100%)' }}>
                <div className="task-panel-header">
                    <div className="task-panel-header-left">
                        <span className="task-panel-id">{task.id}</span>
                        <span
                            className="task-panel-priority-badge"
                            style={{ backgroundColor: getPriorityColor(task.priority) }}
                        >
                            {getPriorityLabel(task.priority)}
                        </span>
                    </div>
                    <button onClick={onClose} className="task-panel-close-btn">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </button>
                </div>

                <div className="task-panel-content">
                    <div className="task-panel-section">
                        <label className="task-panel-label">Заголовок</label>
                        <input
                            type="text"
                            value={task.title}
                            onChange={(e) => onUpdate({ ...task, title: e.target.value })}
                            className="task-panel-input"
                        />
                    </div>

                    <div className="task-panel-section">
                        <label className="task-panel-label">Описание</label>
                        <textarea
                            value={task.description}
                            onChange={(e) => onUpdate({ ...task, description: e.target.value })}
                            className="task-panel-textarea"
                            rows={4}
                        />
                    </div>

                    <div className="task-panel-section">
                        <label className="task-panel-label">Статус</label>
                        <select
                            value={task.status}
                            onChange={(e) => handleStatusChange(e.target.value as Task['status'])}
                            className="task-panel-select"
                        >
                            <option value="todo">Нужно сделать</option>
                            <option value="in-progress">В работе</option>
                            <option value="done">Готово</option>
                        </select>
                    </div>

                    <div className="task-panel-section">
                        <label className="task-panel-label">Приоритет</label>
                        <div className="task-panel-priority-buttons">
                            {(['low', 'medium', 'high'] as Task['priority'][]).map(priority => (
                                <button
                                    key={priority}
                                    onClick={() => handlePriorityChange(priority)}
                                    className="task-panel-priority-btn"
                                    style={{
                                        backgroundColor: task.priority === priority ? getPriorityColor(priority) : 'transparent',
                                        color: task.priority === priority ? 'white' : getPriorityColor(priority),
                                        borderColor: getPriorityColor(priority),
                                    }}
                                >
                                    {getPriorityLabel(priority)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="task-panel-section">
                        <label className="task-panel-label">Исполнитель</label>
                        <div className="task-panel-assignee-block">
                            <select
                                value={task.assignee || ''}
                                onChange={(e) => handleAssigneeChange(e.target.value)}
                                className="task-panel-select"
                            >
                                <option value="">Не назначен</option>
                                {availableUsers.map(user => (
                                    <option key={user} value={user}>{user}</option>
                                ))}
                            </select>
                            {!task.assignee && currentUser && (
                                <button onClick={handleTakeTask} className="task-panel-take-btn">
                                    Взять задачу
                                </button>
                            )}
                            {task.assignee && (
                                <div className="task-panel-assignee">
                                    <div className="task-panel-avatar">{task.assignee.charAt(0).toUpperCase()}</div>
                                    <span className="task-panel-assignee-name">{task.assignee}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="task-panel-section">
                        <label className="task-panel-label">Комментарии ({task.comments.length})</label>
                        <div className="task-panel-comments-list">
                            {task.comments.length === 0 ? (
                                <p className="task-panel-no-comments">Нет комментариев</p>
                            ) : (
                                task.comments.map(comment => (
                                    <div key={comment.id} className="task-panel-comment">
                                        <div className="task-panel-comment-header">
                                            <div className="task-panel-comment-avatar">
                                                {comment.author.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="task-panel-comment-info">
                                                <span className="task-panel-comment-author">{comment.author}</span>
                                                <span className="task-panel-comment-date">
                                                    {comment.createdAt.toLocaleDateString('ru-RU')}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="task-panel-comment-text">{comment.text}</p>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="task-panel-add-comment">
                            <textarea
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Написать комментарий..."
                                className="task-panel-comment-input"
                                rows={3}
                            />
                            <button
                                onClick={handleAddComment}
                                disabled={!commentText.trim()}
                                className="task-panel-add-comment-btn"
                                style={{
                                    opacity: commentText.trim() ? 1 : 0.5,
                                    cursor: commentText.trim() ? 'pointer' : 'not-allowed',
                                }}
                            >
                                Отправить
                            </button>
                        </div>
                    </div>

                    <div className="task-panel-section">
                        <label className="task-panel-label">Действия</label>
                        <div className="task-panel-action-buttons">
                            <button onClick={handleDelete} className="task-panel-action-btn task-panel-delete-btn">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginRight: '6px' }}>
                                    <path d="M2 4h12M6 4V2h4v2M4 4l1 10h6l1-10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                                Удалить
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
