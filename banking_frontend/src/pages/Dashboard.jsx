import { useEffect, useState } from "react";
import { getCustomers } from "../services/customerService";
import { getAccounts } from "../services/accountService";

function Dashboard() {

    const [customers, setCustomers] = useState([]);
    const [accounts, setAccounts] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const loadDashboard = async () => {

            try {

                setLoading(true);
                setError("");

                const [customerResponse, accountResponse] =
                    await Promise.all([getCustomers(), getAccounts()]);

                console.log("Customer response:", customerResponse.data)

                console.log("Account response:", accountResponse.data);

                setCustomers(customerResponse.data.data || []);
                setAccounts(accountResponse.data.data || []);

            } catch (error)
                {

                    console.error("Dashboard API error:", error);

                    if (error.response?.status === 401) {

                        setError("Your session has expired. Please login again.");

                    } else if (error.response?.status === 403) {

                        setError("You do not have permission to access dashboard data.");

                    } else if (error.response) {

                        setError(
                            error.response.data?.message ||
                            "Failed to load dashboard data."
                        );

                    } else {

                        setError(
                            "Unable to connect to the server. Please make sure the backend is running."
                        );
                    }

                }finally {

                setLoading(false);

            }
        };

        loadDashboard();

    }, []);

    if (loading) {
        return (
            <div className="dashboard-page">
                <h1>Banking Dashboard</h1>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-page">

            <h1>Banking Dashboard</h1>

            <p className="dashboard-welcome">
                Welcome to Banking Management System
            </p>

            <p className="dashboard-description">
                Manage customers, accounts and transactions.
            </p>

            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}

            <div className="dashboard-cards">

                <div className="dashboard-card">

                    <h2>Total Customers</h2>

                    <p>
                        {customers.length}
                    </p>

                </div>

                <div className="dashboard-card">

                    <h2>Total Accounts</h2>

                    <p>
                        {accounts.length}
                    </p>

                </div>

            </div>

            <div className="dashboard-section">

                <h2>Recent Customers</h2>

                {customers.length === 0 ? (

                    <p>No customers found.</p>

                ) : (

                    <table className="data-table">

                        <thead>

                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                        </tr>

                        </thead>

                        <tbody>

                        {customers.slice(0, 5).map(
                            (customer) => (

                                <tr
                                    key={customer.customerId}
                                >

                                    <td>
                                        {customer.customerId}
                                    </td>

                                    <td>
                                        {customer.firstName}{" "}
                                        {customer.lastName}
                                    </td>

                                    <td>
                                        {customer.email}
                                    </td>

                                </tr>

                            )
                        )}

                        </tbody>

                    </table>

                )}

            </div>

        </div>
    );
}

export default Dashboard;