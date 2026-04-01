import React from 'react';
import type { FileItem, StorageFile } from './StorageTypes';
import './StorageItem.css';

interface StorageItemComponentProps {
    item: FileItem;
    isSelected: boolean;
    onClick: () => void;
    onDoubleClick: () => void;
}

export const StorageItemComponent: React.FC<StorageItemComponentProps> = ({
    item,
    isSelected,
    onClick,
    onDoubleClick,
}) => {
    const isDirectory = item.type === 'directory';

    const formatSize = (bytes?: number) => {
        if (bytes === undefined) return '';
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
        return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
        });
    };

    const getFileIcon = (extension?: string) => {
        const colorMap: Record<string, string> = {
            'pdf': '#e74c3c',
            'doc': '#3498db',
            'docx': '#3498db',
            'xls': '#27ae60',
            'xlsx': '#27ae60',
            'ppt': '#e67e22',
            'pptx': '#e67e22',
            'txt': '#95a5a6',
            'jpg': '#9b59b6',
            'jpeg': '#9b59b6',
            'png': '#9b59b6',
            'gif': '#9b59b6',
            'svg': '#9b59b6',
            'js': '#f1c40f',
            'ts': '#3178c6',
            'tsx': '#3178c6',
            'jsx': '#61dafb',
            'html': '#e34f26',
            'css': '#264de4',
            'json': '#5c5c5c',
            'md': '#083fa1',
            'zip': '#f39c12',
            'rar': '#f39c12',
        };
        return colorMap[extension || ''] || '#95a5a6';
    };

    return (
        <div
            className="storage-item"
            style={{ backgroundColor: isSelected ? '#e3f2fd' : 'transparent' }}
            onClick={onClick}
            onDoubleClick={onDoubleClick}
        >
            <div className="storage-item-icon">
                {isDirectory ? (
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <path
                            d="M4 8C4 6.89543 4.89543 6 6 6H12L15 9H26C27.1046 9 28 9.89543 28 11V24C28 25.1046 27.1046 26 26 26H6C4.89543 26 4 25.1046 4 24V8Z"
                            fill="#f39c12"
                            stroke="#d68910"
                            strokeWidth="2"
                        />
                    </svg>
                ) : (
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <path
                            d="M8 4C7.44772 4 7 4.44772 7 5V27C7 27.5523 7.44772 28 8 28H24C24.5523 28 25 27.5523 25 27V12L20 7H8Z"
                            fill="white"
                            stroke={getFileIcon(item.extension)}
                            strokeWidth="2"
                        />
                        <path d="M20 7V12H25" stroke={getFileIcon(item.extension)} strokeWidth="2" />
                        {item.extension && (
                            <text x="16" y="23" textAnchor="middle" fontSize="6" fill={getFileIcon(item.extension)} fontWeight="bold">
                                {item.extension.toUpperCase()}
                            </text>
                        )}
                    </svg>
                )}
            </div>
            <div className="storage-item-info">
                <span className="storage-item-name">{item.name}</span>
                <span className="storage-item-meta">
                    {!isDirectory && formatSize((item as StorageFile).size)}
                    {isDirectory && 'Папка'}
                    {' • '}
                    {formatDate(item.modifiedAt)}
                </span>
            </div>
        </div>
    );
};
