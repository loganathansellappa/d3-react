import React from "react";
import { Link } from "react-router-dom";
import "./ContextMenu.scss"; // Make sure to import your SCSS file

interface ContextMenuProps {
  showMenu: boolean;
  position: { top: number; left: number };
  options: { to: string; label: string }[];
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  showMenu,
  position,
  options,
}) => {
  if (!showMenu) return null;

  return (
    <div
      className="context-menu"
      style={{ top: position.top, left: position.left }}
    >
      {options.map((option) => (
        <Link to={option.to} key={option.to} className="context-menu-item">
          {option.label}
        </Link>
      ))}
    </div>
  );
};
