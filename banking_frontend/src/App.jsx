import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard.jsx";
import Customers from "./pages/Customers.jsx";
import Accounts from "./pages/Accounts.jsx";
import Transactions from "./pages/Transactions.jsx";
import Statement from "./pages/Statement.jsx";
import CustomerDashboard from "./pages/CustomerDashboard.jsx";

import MainLayout from "./layouts/MainLayout.jsx";
import Login from "./pages/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import "./App.css";
import CustomerAccounts from "./pages/CustomerAccounts.jsx";
import CustomerTransactions from "./pages/CustomerTransactions.jsx";
import CustomerStatement from "./pages/CustomerStatement.jsx";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* =========================
                    PUBLIC
                ========================= */}

                <Route path="/login" element={<Login />}/>

                {/* =========================
                    ADMIN ROUTES
                ========================= */}

                <Route element={<ProtectedRoute allowedRoles={["ADMIN"]}/>}>

                    <Route element={<MainLayout />}>

                        <Route path="/" element={<Dashboard />}/>

                        <Route path="/customers" element={<Customers />}/>

                        <Route path="/accounts" element={<Accounts />}/>

                        <Route path="/transactions" element={<Transactions />}/>

                        <Route path="/statement" element={<Statement />}/>

                    </Route>

                </Route>

                {/* =========================
                    CUSTOMER ROUTES
                ========================= */}

                <Route
                    element={
                        <ProtectedRoute allowedRoles={["CUSTOMER"]}/>}>

                    <Route element={<MainLayout />}>

                        <Route path="/customer-dashboard" element={<CustomerDashboard />}/>

                        <Route path="/customer-accounts" element={<CustomerAccounts />}/>

                        <Route path="/customer-transactions" element={<CustomerTransactions />}/>

                        <Route path="/customer-statement" element={<CustomerStatement />}/>

                    </Route>

                </Route>

                {/* =========================
                    UNKNOWN ROUTE
                ========================= */}

                <Route path="*" element={<Login />}/>

            </Routes>

        </BrowserRouter>
    );
}

export default App;