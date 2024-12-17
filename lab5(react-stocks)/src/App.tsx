import React from 'react';
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Layout from "./layout";
import Brokers from "./pages/brokers/brokers";
import Settings from "./pages/settings/settings";
import Stocks from "./pages/stocks/stocks";

function App() {
    return (
        <BrowserRouter basename="/">
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route index path="brokers" element={<Brokers/>}/>
                    <Route path="stocks" element={<Stocks/>}/>
                    <Route path="settings" element={<Settings/>}/>
                    <Route path="" element={<Navigate to="/brokers" replace/>}/>
                    <Route path="*" element={<Navigate to="/" replace/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
