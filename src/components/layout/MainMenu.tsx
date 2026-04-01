import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useAuth } from '../auth/AuthProvider';
import { TasksBoard } from '../tasks/TasksBoard';
import type { Task } from '../tasks/TasksBoard';
import { TaskDetailsPanel, type Comment } from '../tasks/TaskDetailsPanel';
import { Storage } from '../storage/Storage';
import type { FileItem } from '../storage/StorageTypes';
import { Chat, type Message } from '../chat/Chat';
import './MainMenu.css';

type Tab = 'tasks' | 'storage' | 'chat';

const fakeTasks: Task[] = [
    {
        id: 'TASK-1',
        title: 'Настроить CI/CD пайплайн',
        description: 'Интегрировать GitHub Actions для автоматического деплоя',
        priority: 'high',
        assignee: 'Alex',
        status: 'in-progress',
        comments: [
            { id: 'c1', author: 'Maria', text: 'Нужно обсудить конфигурацию', createdAt: new Date('2024-01-15') },
        ],
    },
    {
        id: 'TASK-2',
        title: 'Дизайн главной страницы',
        description: 'Создать макет в Figma для главной страницы проекта',
        priority: 'medium',
        assignee: 'Maria',
        status: 'todo',
        comments: [],
    },
    {
        id: 'TASK-3',
        title: 'Рефакторинг AuthProvider',
        description: 'Упростить логику управления состоянием авторизации',
        priority: 'low',
        assignee: 'John',
        status: 'done',
        comments: [
            { id: 'c1', author: 'John', text: 'Готово, можно тестировать', createdAt: new Date('2024-01-14') },
            { id: 'c2', author: 'Alex', text: 'Проверил, всё работает!', createdAt: new Date('2024-01-14') },
        ],
    },
    {
        id: 'TASK-4',
        title: 'Интеграция с бэкендом',
        description: 'Подключить REST API для получения списка проектов',
        priority: 'high',
        assignee: 'Alex',
        status: 'todo',
        comments: [],
    },
    {
        id: 'TASK-5',
        title: 'Написать тесты для форм',
        description: 'Покрыть unit-тестами компоненты AuthForm и MainMenu',
        priority: 'medium',
        assignee: 'Maria',
        status: 'in-progress',
        comments: [],
    },
    {
        id: 'TASK-6',
        title: 'Обновить документацию',
        description: 'Добавить описание API endpoints в README',
        priority: 'low',
        assignee: undefined,
        status: 'todo',
        comments: [],
    },
];

const fakeFiles: FileItem[] = [
    { id: 'dir-1', name: 'Документы', type: 'directory', createdAt: new Date('2024-01-01'), modifiedAt: new Date('2024-01-15'), path: '/Документы', parentId: null },
    { id: 'dir-2', name: 'Изображения', type: 'directory', createdAt: new Date('2024-01-02'), modifiedAt: new Date('2024-01-14'), path: '/Изображения', parentId: null },
    { id: 'dir-3', name: 'Проекты', type: 'directory', createdAt: new Date('2024-01-03'), modifiedAt: new Date('2024-01-16'), path: '/Проекты', parentId: null },
    { id: 'file-1', name: 'README.md', type: 'file', size: 2048, extension: 'md', createdAt: new Date('2024-01-10'), modifiedAt: new Date('2024-01-10'), path: '/README.md', parentId: null },
    { id: 'file-2', name: 'package.json', type: 'file', size: 1536, extension: 'json', createdAt: new Date('2024-01-05'), modifiedAt: new Date('2024-01-12'), path: '/package.json', parentId: null },
    { id: 'file-3', name: 'Техническое задание.docx', type: 'file', size: 524288, extension: 'docx', createdAt: new Date('2024-01-08'), modifiedAt: new Date('2024-01-15'), path: '/Документы/Техническое задание.docx', parentId: 'dir-1' },
    { id: 'file-4', name: 'Презентация.pptx', type: 'file', size: 2097152, extension: 'pptx', createdAt: new Date('2024-01-09'), modifiedAt: new Date('2024-01-14'), path: '/Документы/Презентация.pptx', parentId: 'dir-1' },
    { id: 'file-5', name: 'Бюджет.xlsx', type: 'file', size: 102400, extension: 'xlsx', createdAt: new Date('2024-01-11'), modifiedAt: new Date('2024-01-13'), path: '/Документы/Бюджет.xlsx', parentId: 'dir-1' },
    { id: 'dir-4', name: 'Договоры', type: 'directory', createdAt: new Date('2024-01-04'), modifiedAt: new Date('2024-01-12'), path: '/Документы/Договоры', parentId: 'dir-1' },
    { id: 'file-6', name: 'logo.png', type: 'file', size: 51200, extension: 'png', createdAt: new Date('2024-01-06'), modifiedAt: new Date('2024-01-06'), path: '/Изображения/logo.png', parentId: 'dir-2' },
    { id: 'file-7', name: 'banner.jpg', type: 'file', size: 1048576, extension: 'jpg', createdAt: new Date('2024-01-07'), modifiedAt: new Date('2024-01-08'), path: '/Изображения/banner.jpg', parentId: 'dir-2' },
    { id: 'file-8', name: 'icon.svg', type: 'file', size: 4096, extension: 'svg', createdAt: new Date('2024-01-07'), modifiedAt: new Date('2024-01-07'), path: '/Изображения/icon.svg', parentId: 'dir-2' },
    { id: 'file-9', name: 'app.tsx', type: 'file', size: 8192, extension: 'tsx', createdAt: new Date('2024-01-10'), modifiedAt: new Date('2024-01-16'), path: '/Проекты/app.tsx', parentId: 'dir-3' },
    { id: 'file-10', name: 'styles.css', type: 'file', size: 4096, extension: 'css', createdAt: new Date('2024-01-10'), modifiedAt: new Date('2024-01-15'), path: '/Проекты/styles.css', parentId: 'dir-3' },
    { id: 'file-11', name: 'index.html', type: 'file', size: 2048, extension: 'html', createdAt: new Date('2024-01-10'), modifiedAt: new Date('2024-01-14'), path: '/Проекты/index.html', parentId: 'dir-3' },
    { id: 'dir-5', name: 'Компоненты', type: 'directory', createdAt: new Date('2024-01-11'), modifiedAt: new Date('2024-01-16'), path: '/Проекты/Компоненты', parentId: 'dir-3' },
    { id: 'file-12', name: 'Договор_001.pdf', type: 'file', size: 262144, extension: 'pdf', createdAt: new Date('2024-01-05'), modifiedAt: new Date('2024-01-05'), path: '/Документы/Договоры/Договор_001.pdf', parentId: 'dir-4' },
    { id: 'file-13', name: 'Договор_002.pdf', type: 'file', size: 307200, extension: 'pdf', createdAt: new Date('2024-01-06'), modifiedAt: new Date('2024-01-12'), path: '/Документы/Договоры/Договор_002.pdf', parentId: 'dir-4' },
    { id: 'file-14', name: 'Header.tsx', type: 'file', size: 3072, extension: 'tsx', createdAt: new Date('2024-01-12'), modifiedAt: new Date('2024-01-16'), path: '/Проекты/Компоненты/Header.tsx', parentId: 'dir-5' },
    { id: 'file-15', name: 'Footer.tsx', type: 'file', size: 2048, extension: 'tsx', createdAt: new Date('2024-01-12'), modifiedAt: new Date('2024-01-15'), path: '/Проекты/Компоненты/Footer.tsx', parentId: 'dir-5' },
    { id: 'file-16', name: 'archive.zip', type: 'file', size: 10485760, extension: 'zip', createdAt: new Date('2024-01-01'), modifiedAt: new Date('2024-01-01'), path: '/archive.zip', parentId: null },
];

const availableUsers = ['Alex', 'Maria', 'John'];

const fakeMessages: Message[] = [
    { id: 'msg-1', author: 'Alex', text: 'Всем привет! Как продвигается проект?', createdAt: new Date('2024-01-16 10:00'), isOwn: false },
    { id: 'msg-2', author: 'Maria', text: 'Привет! Я закончила дизайн главной страницы 🎨', createdAt: new Date('2024-01-16 10:05'), isOwn: false },
    { id: 'msg-3', author: 'User', text: 'Отлично! Я сейчас настраиваю CI/CD пайплайн', createdAt: new Date('2024-01-16 10:10'), isOwn: true },
    { id: 'msg-4', author: 'John', text: 'Рефакторинг AuthProvider завершён, можно тестировать', createdAt: new Date('2024-01-16 10:15'), isOwn: false },
    { id: 'msg-5', author: 'Alex', text: 'Кто может посмотреть код перед деплоем?', createdAt: new Date('2024-01-16 10:20'), isOwn: false },
];

const tabs: Record<Tab, string> = {
    tasks: 'Доска задач',
    storage: 'Хранилище',
    chat: 'Чат',
};

export const MainMenu: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [activeTab, setActiveTab] = useState<Tab>((searchParams.get('tab') as Tab) || 'tasks');
    const [tasks, setTasks] = useState<Task[]>(fakeTasks);
    const [files, setFiles] = useState<FileItem[]>(fakeFiles);
    const [messages, setMessages] = useState<Message[]>(fakeMessages);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(searchParams.get('task') || null);
    const [isPanelOpen, setIsPanelOpen] = useState(!!searchParams.get('task'));

    const selectedTask = tasks.find(t => t.id === selectedTaskId) || null;

    useEffect(() => {
        setSearchParams({ tab: activeTab, ...(selectedTaskId ? { task: selectedTaskId } : {}) });
    }, [activeTab, selectedTaskId]);

    const handleTaskMove = (taskId: string, newStatus: Task['status']) => {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    };

    const handleTaskClick = (task: Task) => {
        setSelectedTaskId(task.id);
        setIsPanelOpen(true);
    };

    const handlePanelClose = () => {
        setIsPanelOpen(false);
        setSelectedTaskId(null);
    };

    const handleTaskUpdate = (updatedTask: Task) => {
        setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
        setSelectedTaskId(updatedTask.id);
    };

    const handleTaskDelete = (taskId: string) => {
        setTasks(prev => prev.filter(t => t.id !== taskId));
        handlePanelClose();
    };

    const handleAddComment = (taskId: string, text: string) => {
        const newComment: Comment = {
            id: `c${Date.now()}`,
            author: user?.email?.split('@')[0] || 'User',
            text,
            createdAt: new Date(),
        };
        setTasks(prev => prev.map(t =>
            t.id === taskId
                ? { ...t, comments: [...t.comments, newComment] }
                : t
        ));
    };

    const handleStorageNavigate = (path: string) => {
        console.log('Navigated to path:', path);
    };

    const handleFileOpen = (file: FileItem) => {
        alert(`Открытие файла: ${file.name}`);
    };

    const handleCreateDirectory = (name: string, parentId: string | null) => {
        const newDir: FileItem = {
            id: `dir-${Date.now()}`,
            name,
            type: 'directory',
            createdAt: new Date(),
            modifiedAt: new Date(),
            path: `/${name}`,
            parentId,
        };
        setFiles(prev => [...prev, newDir]);
    };

    const handleCreateFile = (name: string, parentId: string | null) => {
        const extension = name.split('.').pop() || '';
        const newFile: FileItem = {
            id: `file-${Date.now()}`,
            name,
            type: 'file',
            size: 0,
            extension,
            createdAt: new Date(),
            modifiedAt: new Date(),
            path: `/${name}`,
            parentId,
        };
        setFiles(prev => [...prev, newFile]);
    };

    const handleSendMessage = (text: string) => {
        console.log('Sending message:', text);
        // В будущем здесь будет отправка на бэкенд
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'tasks':
                return <TasksBoard tasks={tasks} onTaskMove={handleTaskMove} onTaskClick={handleTaskClick} />;
            case 'storage':
                return <Storage items={files} onNavigate={handleStorageNavigate} onFileOpen={handleFileOpen} onCreateFile={handleCreateFile} onCreateDirectory={handleCreateDirectory} />;
            case 'chat':
                return <Chat messages={messages} currentUser={user?.email?.split('@')[0] || 'User'} onSendMessage={handleSendMessage} />;
        }
    };

    return (
        <div className="main-menu-container">
            <aside className="main-menu-sidebar">
                <div className="main-menu-sidebar-header">
                    <div className="main-menu-header-content">
                        <div>
                            <h3 className="main-menu-logo">Project Tracker</h3>
                            <span className="main-menu-user-email">{user?.email}</span>
                        </div>
                        <button onClick={logout} className="main-menu-logout-btn" title="Выйти">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M10 3H5C4.44772 3 4 3.44772 4 4V16C4 16.5523 4.44772 17 5 17H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                <path d="M16 10H8M16 10L13 7M16 10L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                </div>
                <nav className="main-menu-nav">
                    {(Object.keys(tabs) as Tab[]).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`main-menu-nav-btn ${activeTab === tab ? 'main-menu-nav-btn-active' : ''}`}
                        >
                            {tabs[tab]}
                        </button>
                    ))}
                </nav>
            </aside>
            <main className="main-menu-main">
                {renderTabContent()}
            </main>
            <TaskDetailsPanel
                task={selectedTask}
                isOpen={isPanelOpen}
                onClose={handlePanelClose}
                onUpdate={handleTaskUpdate}
                onDelete={handleTaskDelete}
                onAddComment={handleAddComment}
                currentUser={user?.email?.split('@')[0]}
                availableUsers={availableUsers}
            />
        </div>
    );
};
