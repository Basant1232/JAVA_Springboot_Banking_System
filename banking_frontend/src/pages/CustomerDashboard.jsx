import {useEffect, useState} from "react";
import { getMyProfile } from "../services/customerService";
import { getMyAccounts } from "../services/accountService";
import { getMyTransactions } from "../services/transactionService";
import {useNavigate} from "react-router-dom";


function  CustomerDashboard(){

    const navigate = useNavigate();


    const [profile, setProfile] = useState(null);
    const [accounts , setAccounts] =useState([]);
    const [transactions , setTransactions] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect( () =>{

        const loadCustomerDashboard = async () => {

            try{
                setLoading(true);
                setError("");

                const [profileResponse, accountsResponse, transactionsResponse] =
                    await Promise.all([
                        getMyProfile(),
                        getMyAccounts(),
                        getMyTransactions()
                    ]);

                console.log("Customer profile:", profileResponse.data);
                console.log("Customer accounts:", accountsResponse.data);
                console.log("Customer transactions:", transactionsResponse.data);

                setProfile(profileResponse.data.data);
                setAccounts(accountsResponse.data.data || []);
                setTransactions(transactionsResponse.data.data || []);

            }
            catch(error){
                console.error(
                    "Customer dashboard error:",
                    error
                );

                setError(error.response?.data?.message ||
                "Failed to load customer dashboard");
            }
            finally {
                setLoading(false);
            }
        };

        loadCustomerDashboard();
    }, []);

    if(loading){
        return(

            <div className="dashboard-page">

                <h1>Customer Dashboard</h1>
                <p>Loading Dashboard......</p>
            </div>
        );
    }

    return (

        <div className="dashboard-page">

            <h1>Customer Dashboard</h1>

            {error && (
                <p className="error-message">{error}</p>
            )}

            {profile && (

                <div className="dashboard-section">

                    <h2>My Profile</h2>
                    <p>
                        <strong>Email:</strong>
                        {" "}
                        {profile.email}
                    </p>

                    <p>
                        <strong>Mobile:</strong>{" "}
                        {profile.mobile}
                    </p>

                </div>
            )}


            <div className="dashboard-cards">

                <div className="dashboard-card">

                    <h2>My Accounts</h2>

                    <p>{accounts.length}</p>

                </div>

                <div className="dashboard-card">

                    <h2>Transactions</h2>

                    <p>{transactions.length}</p>

                </div>

                <div className="dashboard-card">

                    <h2>Total Balance</h2>
                    <p>
                        ₹
                        {accounts.reduce((total, account) => total + Number(account.balance || 0),
                            0
                            )
                        .toFixed(2)}
                    </p>

                </div>

        </div>




            <div className="dashboard-section">

                <h2>My Accounts</h2>

                {accounts.length === 0 ? (

                    <p>No accounts found.</p>

                ) : (

                    <table className="data-table">

                        <thead>
                        <tr>
                            <th>Account Number</th>
                            <th>Account Type</th>
                            <th>Balance</th>
                        </tr>
                        </thead>

                        <tbody>

                        {accounts.map((account) => (

                            <tr key={account.accountId}>

                                <td>
                                    {account.accountNumber}
                                </td>

                                <td>
                                    {account.accountType}
                                </td>

                                <td>
                                    ₹{account.balance}
                                </td>

                            </tr>

                        ))}

                        </tbody>

                    </table>

                )}

            </div>

            <div className="dashboard-section">

                <div className="section-header">

                    <h2>Recent Transactions</h2>

                    <button
                        className="view-all-button"
                        onClick={() => navigate("/customer-transactions")}
                    >
                        View All Transactions
                    </button>

                </div>
                {transactions.length === 0 ? (

                    <p>No transactions found.</p>

                ) : (

                    <table className="data-table">

                        <thead>
                        <tr>
                            <th>Account</th>
                            <th>Type</th>
                            <th>Amount</th>
                            <th>Date</th>
                        </tr>
                        </thead>

                        <tbody>

                        {transactions
                            .slice(0, 5)
                            .map((transaction) => (

                                <tr
                                    key={transaction.transactionId}
                                >

                                    <td>
                                        {transaction.accountNumber}
                                    </td>

                                    <td>
                                        {transaction.transactionType}
                                    </td>

                                    <td>
                                        ₹
                                        {Number(
                                            transaction.amount || 0
                                        ).toFixed(2)}
                                    </td>

                                    <td>
                                        {transaction.transactionDate}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                )}

            </div>

        </div>

    );


}

export default CustomerDashboard;