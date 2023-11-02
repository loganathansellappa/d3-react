import React from "react";
import { Link } from "react-router-dom";

const OverviewContextMenu: React.FC = () => {
  return (
    <div className="context-menu">
      <Link to="/balance">Balance Sheet</Link>
      <Link to="/income">Income Statement</Link>
      <Link to="/chart">Chart</Link>
    </div>
  );
};

export default OverviewContextMenu;
