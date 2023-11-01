// TabbedComponent.js

import React from 'react';
import './Tabs.scss';
import {Link, useLocation} from "react-router-dom";

export const Tabs: React.FC = () => {
    const location = useLocation();
    return (
        <div className="tabs" >
            <Link to="/overview" className={`tab-link ${location.pathname === '/overview' ? 'active-tab' : ''}`}>
                Overview
            </Link>
            <Link to="/balance" className={`tab-link ${location.pathname === '/balance' ? 'active-tab' : ''}`}>
                Balance Sheet
            </Link>
            <Link to="/income" className={`tab-link ${location.pathname === '/income' ? 'active-tab' : ''}`}>
                Income Statement
            </Link>
            <Link to="/chart" className={`tab-link ${location.pathname === '/chart' ? 'active-tab' : ''}`}>
                Chart
            </Link>
        </div>
    );
};