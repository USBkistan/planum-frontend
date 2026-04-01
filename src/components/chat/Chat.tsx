import React, { useState, useRef, useEffect } from 'react';
import './Chat.css';

export interface Message {
    id: string;
    author: string;
    text: string;
    createdAt: Date;
    isOwn: boolean;
}

interface ChatProps {
    messages?: Message[];
    currentUser?: string;
    onSendMessage?: (text: string) => void;
}

export const Chat: React.FC<ChatProps> = ({
    messages: initialMessages = [],
    currentUser = 'User',
    onSendMessage,
}) => {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (inputValue.trim()) {
            const newMessage: Message = {
                id: `msg-${Date.now()}`,
                author: currentUser,
                text: inputValue.trim(),
                createdAt: new Date(),
                isOwn: true,
            };

            setMessages(prev => [...prev, newMessage]);
            onSendMessage?.(inputValue.trim());
            setInputValue('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getAvatarColor = (name: string) => {
        const colors = ['#6610f2', '#e91e63', '#007bff', '#28a745', '#fd7e14', '#20c997'];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    return (
        <div className="chat-container">
            <div className="chat-messages">
                {messages.length === 0 ? (
                    <div className="chat-empty">
                        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                            <path d="M12 16c0-2.2 1.8-4 4-4h32c2.2 0 4 1.8 4 4v24c0 2.2-1.8 4-4 4H24l-8 8V16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M22 24h20M22 32h14M22 40h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        <p>Пока нет сообщений</p>
                        <p style={{ fontSize: '13px' }}>Начните обсуждение!</p>
                    </div>
                ) : (
                    messages.map(message => (
                        <div
                            key={message.id}
                            className={`chat-message ${message.isOwn ? 'chat-message-right' : 'chat-message-left'}`}
                        >
                            <div
                                className="chat-message-avatar"
                                style={{ backgroundColor: getAvatarColor(message.author) }}
                            >
                                {message.author.charAt(0).toUpperCase()}
                            </div>
                            <div className="chat-message-content">
                                {!message.isOwn && (
                                    <span className="chat-message-sender">{message.author}</span>
                                )}
                                <div className="chat-message-bubble">
                                    {message.text}
                                </div>
                                <span className="chat-message-time">{formatTime(message.createdAt)}</span>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-container">
                <textarea
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Напишите сообщение..."
                    className="chat-input"
                    rows={1}
                />
                <button
                    onClick={handleSend}
                    disabled={!inputValue.trim()}
                    className="chat-send-btn"
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 2L18 10L10 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                </button>
            </div>
        </div>
    );
};
