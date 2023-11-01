import React from "react";
import {BrowserRouter,  Route, Routes} from "react-router-dom";
import './App.scss';
import {Tabs} from "./components/Tabs";
import {Overview} from "./components/Overview";
import {IncomeStatement} from "./components/IncomeStatement";
import {BalanceSheet} from "./components/BalanceSheet";
import {ContextMenuProvider} from "./components/ContextMenuProvider";
import {QueryClient, QueryClientProvider} from "react-query";
import {Chart} from "./components/Chart";

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
                                    <Route path="/overview" index element={<Overview/>} />
                                    <Route path="/balance" element={<BalanceSheet />} />
                                    <Route path="/income" element={<IncomeStatement />} />
                                    <Route path="/chart" element={<Chart />} />
                                </Routes>
                            </div>
                            <footer className="footer">Footer</footer>
                        </div>
                    </ContextMenuProvider>
                        </QueryClientProvider>
                </BrowserRouter>

    );
};

export default App;
