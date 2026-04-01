import React, { useState, useMemo } from 'react';
import { StorageItemComponent } from './StorageItem';
import type { FileItem, StorageFile } from './StorageTypes';
import './Storage.css';

type SortType = 'name' | 'size' | 'type' | 'date';

interface StorageProps {
    items: FileItem[];
    onNavigate?: (path: string) => void;
    onFileOpen?: (file: StorageFile) => void;
    onCreateFile?: (name: string, parentId: string | null) => void;
    onCreateDirectory?: (name: string, parentId: string | null) => void;
}

export const Storage: React.FC<StorageProps> = ({
    items,
    onNavigate,
    onFileOpen,
    onCreateFile,
    onCreateDirectory,
}) => {
    const [currentPath, setCurrentPath] = useState<string>('');
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const [showNewFolderModal, setShowNewFolderModal] = useState(false);
    const [showNewFileModal, setShowNewFileModal] = useState(false);
    const [newItemName, setNewItemName] = useState('');
    const [sortType, setSortType] = useState<SortType>('name');

    const getCurrentItems = () => {
        return items.filter(item =>
            (item.parentId === currentPath) ||
            (item.parentId === null && currentPath === '') ||
            (item.parentId === undefined && currentPath === '')
        );
    };

    const sortedItems = useMemo(() => {
        const currentItems = getCurrentItems();

        return [...currentItems].sort((a, b) => {
            if (a.type === 'directory' && b.type === 'file') return -1;
            if (a.type === 'file' && b.type === 'directory') return 1;

            switch (sortType) {
                case 'name':
                    return a.name.localeCompare('ru-RU');
                case 'size':
                    const aSize = (a as StorageFile).size || 0;
                    const bSize = (b as StorageFile).size || 0;
                    return bSize - aSize;
                case 'type':
                    const aExt = (a as StorageFile).extension || '';
                    const bExt = (b as StorageFile).extension || '';
                    return aExt.localeCompare(bExt, 'ru-RU');
                case 'date':
                    return new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime();
                default:
                    return 0;
            }
        });
    }, [items, currentPath, sortType]);

    const getPathSegments = () => {
        if (!currentPath) return [];
        const segments: { path: string; name: string }[] = [];
        let path = currentPath;

        while (path) {
            const folder = items.find(i => i.id === path);
            if (!folder) break;
            segments.unshift({ path: folder.id, name: folder.name });
            path = folder.parentId || '';
        }
        return segments;
    };

    const handleNavigate = (path: string) => {
        setCurrentPath(path);
        setSelectedItem(null);
        onNavigate?.(path);
    };

    const handleItemClick = (item: FileItem) => {
        setSelectedItem(item.id);
    };

    const handleItemDoubleClick = (item: FileItem) => {
        if (item.type === 'directory') {
            handleNavigate(item.id);
        } else {
            onFileOpen?.(item as StorageFile);
        }
    };

    const handleBreadcrumbClick = (path: string, index: number) => {
        if (index === -1) {
            handleNavigate('');
        } else {
            handleNavigate(path);
        }
    };

    const handleCreateFolder = () => {
        if (newItemName.trim()) {
            onCreateDirectory?.(newItemName.trim(), currentPath || null);
            setNewItemName('');
            setShowNewFolderModal(false);
        }
    };

    const handleCreateFile = () => {
        if (newItemName.trim()) {
            onCreateFile?.(newItemName.trim(), currentPath || null);
            setNewItemName('');
            setShowNewFileModal(false);
        }
    };

    const currentItems = sortedItems;
    const pathSegments = getPathSegments();

    return (
        <div className="storage-container">
            <div className="storage-header">
                <div className="storage-breadcrumb">
                    <button
                        onClick={() => handleBreadcrumbClick('', -1)}
                        className={`storage-breadcrumb-item ${currentPath === '' ? 'storage-breadcrumb-active' : ''}`}
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M8 1L1 7h2v7h10V7h2L8 1z" fill="currentColor"/>
                        </svg>
                    </button>
                    {pathSegments.map((segment, index) => (
                        <React.Fragment key={segment.path}>
                            <span className="storage-breadcrumb-separator">/</span>
                            <button
                                onClick={() => handleBreadcrumbClick(segment.path, index)}
                                className={`storage-breadcrumb-item ${currentPath === segment.path ? 'storage-breadcrumb-active' : ''}`}
                            >
                                {segment.name}
                            </button>
                        </React.Fragment>
                    ))}
                </div>
                <div className="storage-header-actions">
                    <div className="storage-sort-dropdown">
                        <select
                            value={sortType}
                            onChange={(e) => setSortType(e.target.value as SortType)}
                            className="storage-sort-select"
                        >
                            <option value="name">По имени</option>
                            <option value="size">По размеру</option>
                            <option value="type">По типу</option>
                            <option value="date">По дате</option>
                        </select>
                    </div>
                    <button onClick={() => setShowNewFolderModal(true)} className="storage-action-btn">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginRight: '6px' }}>
                            <path d="M8 1L1 7h2v7h10V7h2L8 1z" fill="currentColor"/>
                            <path d="M8 4v8M4 8h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        Папка
                    </button>
                    <button onClick={() => setShowNewFileModal(true)} className="storage-action-btn">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginRight: '6px' }}>
                            <path d="M9 1H4a1 1 0 00-1 1v12a1 1 0 001 1h8a1 1 0 001-1V6l-3-5z" fill="currentColor"/>
                            <path d="M8 4v8M4 8h8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        Файл
                    </button>
                </div>
            </div>

            <div className="storage-content">
                {currentItems.length === 0 ? (
                    <div className="storage-empty">
                        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                            <path
                                d="M8 16C8 14.8954 8.89543 14 10 14H18L22 20H54C55.1046 20 56 20.8954 56 22V50C56 51.1046 55.1046 52 54 52H10C8.89543 52 8 51.1046 8 50V16Z"
                                fill="#e9ecef"
                            />
                        </svg>
                        <p className="storage-empty-text">Эта папка пуста</p>
                    </div>
                ) : (
                    <div className="storage-grid">
                        {currentItems.map(item => (
                            <StorageItemComponent
                                key={item.id}
                                item={item}
                                isSelected={selectedItem === item.id}
                                onClick={() => handleItemClick(item)}
                                onDoubleClick={() => handleItemDoubleClick(item)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {showNewFolderModal && (
                <div className="storage-modal-overlay" onClick={() => setShowNewFolderModal(false)}>
                    <div className="storage-modal" onClick={e => e.stopPropagation()}>
                        <h3 className="storage-modal-title">Новая папка</h3>
                        <input
                            type="text"
                            value={newItemName}
                            onChange={e => setNewItemName(e.target.value)}
                            placeholder="Название папки"
                            className="storage-modal-input"
                            autoFocus
                            onKeyDown={e => e.key === 'Enter' && handleCreateFolder()}
                        />
                        <div className="storage-modal-actions">
                            <button onClick={() => setShowNewFolderModal(false)} className="storage-modal-cancel-btn">
                                Отмена
                            </button>
                            <button onClick={handleCreateFolder} className="storage-modal-confirm-btn">
                                Создать
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showNewFileModal && (
                <div className="storage-modal-overlay" onClick={() => setShowNewFileModal(false)}>
                    <div className="storage-modal" onClick={e => e.stopPropagation()}>
                        <h3 className="storage-modal-title">Новый файл</h3>
                        <input
                            type="text"
                            value={newItemName}
                            onChange={e => setNewItemName(e.target.value)}
                            placeholder="Название файла"
                            className="storage-modal-input"
                            autoFocus
                            onKeyDown={e => e.key === 'Enter' && handleCreateFile()}
                        />
                        <div className="storage-modal-actions">
                            <button onClick={() => setShowNewFileModal(false)} className="storage-modal-cancel-btn">
                                Отмена
                            </button>
                            <button onClick={handleCreateFile} className="storage-modal-confirm-btn">
                                Создать
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
