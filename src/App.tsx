import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.scss";
import { Tabs } from "./components/home/Tabs";
import { Overview } from "./components/home/Overview";
import { IncomeStatement } from "./components/financials/IncomeStatement";
import { BalanceSheet } from "./components/financials/BalanceSheet";
import { ContextMenuProvider } from "./components/contextMenu/ContextMenuProvider";
import { QueryClient, QueryClientProvider } from "react-query";
import { Chart } from "./components/charts/Chart";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ContextMenuProvider>
          <div className="app-component">
            <Tabs />
            <div className="content">
              <Routes>
                {[
                  { path: "/", element: <Overview /> },
                  { path: "/overview", element: <Overview /> },
                  { path: "/balance", element: <BalanceSheet /> },
                  { path: "/income", element: <IncomeStatement /> },
                  { path: "/chart", element: <Chart /> },
                  { path: "*", element: <Overview /> },
                ].map((route, index) => (
                  <Route
                    key={index}
                    path={route.path}
                    element={route.element}
                  />
                ))}
              </Routes>
            </div>
            <footer className="footer">@Demo App </footer>
          </div>
        </ContextMenuProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
