import { useEffect, useState } from "react";
import { getMyTransactions } from "../services/transactionService";

function CustomerTransactions() {

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const loadTransactions = async () => {

            try {

                setLoading(true);
                setError("");

                const response = await getMyTransactions();

                console.log(
                    "My transactions:",
                    response.data
                );

                setTransactions(
                    response.data.data || []
                );

            } catch (error) {

                console.error(
                    "Customer transactions error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load transactions"
                );

            } finally {

                setLoading(false);

            }
        };

        loadTransactions();

    }, []);

    if (loading) {

        return (
            <div className="dashboard-page">

                <h1>My Transactions</h1>

                <p>Loading transactions...</p>

            </div>
        );
    }

    return (

        <div className="dashboard-page">

            <h1>My Transactions</h1>

            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}

            <div className="dashboard-section">

                {transactions.length === 0 ? (

                    <p>
                        No transactions found.
                    </p>

                ) : (

                    <table className="data-table">

                        <thead>

                        <tr>

                            <th>Account</th>

                            <th>Type</th>

                            <th>Amount</th>

                            <th>Date</th>

                            <th>Remarks</th>

                        </tr>

                        </thead>

                        <tbody>

                        {transactions.map(
                            (transaction) => (

                                <tr
                                    key={
                                        transaction.transactionId
                                    }
                                >

                                    <td>
                                        {
                                            transaction.accountNumber
                                        }
                                    </td>

                                    <td>
                                        {
                                            transaction.transactionType
                                        }
                                    </td>

                                    <td>
                                        ₹
                                        {Number(
                                            transaction.amount || 0
                                        ).toFixed(2)}
                                    </td>

                                    <td>
                                        {
                                            transaction.transactionDate
                                        }
                                    </td>

                                    <td>
                                        {
                                            transaction.remarks ||
                                            "-"
                                        }
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

export default CustomerTransactions;