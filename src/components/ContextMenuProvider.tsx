// Layout.tsx
import React, { useState } from 'react';
import {ContextMenu} from "./ContextMenu";
interface LayoutProps {
    children: React.ReactNode;
}

export const ContextMenuProvider: React.FC<LayoutProps> = ({ children }) => {
    const [contextMenu, setContextMenu] = useState<{ show: boolean; top: number; left: number }>({
        show: false,
        top: 0,
        left: 0,
    });
    const menuOptions = [
        { to: '/overview', label: 'Overview' },
        { to: '/balance', label: 'Balance Sheet' },
        { to: '/income', label: 'Income Statement' },
        { to: '/chart', label: 'Chart' },
    ];

    const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        console.log("Right Click");
        setContextMenu({ show: true, top: e.clientY, left: e.clientX });
    };

    const handleContextMenuClose = () => {
        setContextMenu({ show: false, top: 0, left: 0 });
    };

    return (
        <div onContextMenu={handleContextMenu} onClick={handleContextMenuClose}>
            {children}
            <ContextMenu showMenu={contextMenu.show} position={{ top: contextMenu.top, left: contextMenu.left }} options={menuOptions} />
        </div>
    );
};