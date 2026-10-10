import { useState } from "react";
import { getStatement } from "../services/transactionService";

function Statement() {

    const [accountId, setAccountId] = useState("");
    const [statement, setStatement] = useState(null);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [page, setPage] = useState(0);

    const size = 10;

    const fetchStatement = async (pageNumber = 0) => {

        setError("");

        if (!accountId) {
            setError("Account ID is required");
            return;
        }

        try {

            setLoading(true);

            const response = await getStatement(
                Number(accountId),
                pageNumber,
                size
            );

            setStatement(response.data.data);
            setPage(pageNumber);

        } catch (error) {

            console.error("Statement error:", error);

            setStatement(null);

            if (error.response?.status === 401) {

                setError("Your session has expired. Please login again.");

            } else if (error.response?.status === 403) {

                setError(
                    "You do not have permission to view this statement."
                );

            } else if (error.response) {

                setError(
                    error.response.data?.message ||
                    "Failed to fetch statement."
                );

            } else {

                setError(
                    "Unable to connect to the server. Please make sure the backend is running."
                );
            }

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="statement-page">

            <h1>Transaction Statement</h1>

            <div className="statement-search">

                <label>Account ID: </label>

                <input
                    type="number"
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                    placeholder="Enter Account ID"
                />

                <button
                    type="button"
                    className="primary-button"
                    onClick={() => fetchStatement(0)}
                    disabled={loading}
                >
                    {loading ? "Loading..." : "View Statement"}
                </button>

            </div>

            <br />

            {error && (
                <p className="error-message">{error}</p>
            )}
            {loading && (
                <p>Loading statement...</p>
            )}

            {statement && (
                <div className="statement-content">

                    <h2>Account Details</h2>

                    <div className="account-summary">

                    <p>
                        <strong>Account Number:</strong>{" "}
                        {statement.accountNumber}
                    </p>

                    <p>
                        <strong>Current Balance:</strong>{" "}
                        ₹{statement.currentBalance}
                    </p>

                    <p>
                        <strong>Total Transactions:</strong>{" "}
                        {statement.totalTransactions}
                    </p>

                    </div>

                    <hr />

                    <h2>Transactions</h2>

                    {statement.transactions.length === 0 ? (
                        <p>No transactions found.</p>
                    ) : (
                        <div className="table-container">
                        <table className="data-table">

                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Type</th>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>Remarks</th>
                            </tr>
                            </thead>

                            <tbody>

                            {statement.transactions.map(
                                (transaction) => (

                                    <tr key={transaction.transactionId}>

                                        <td>
                                            {transaction.transactionId}
                                        </td>

                                        <td>
                                            {transaction.transactionType}
                                        </td>

                                        <td>
                                            ₹{transaction.amount}
                                        </td>

                                        <td>
                                            {transaction.transactionDate}
                                        </td>

                                        <td>
                                            {transaction.remarks}
                                        </td>

                                    </tr>
                                )
                            )}

                            </tbody>

                        </table>
                            </div>
                    )}

                    <br />

                    <div className="pagination">

                        <button type="button"
                            disabled={statement.firstPage}
                            onClick={() => fetchStatement(page - 1)}
                        >
                            Previous
                        </button>

                        {" "}

                        <span>
                            Page {statement.currentPage + 1} of{" "}
                            {statement.totalPages}
                        </span>

                        {" "}

                        <button type="button"
                            disabled={statement.lastPage}
                            onClick={() => fetchStatement(page + 1)}
                        >
                            Next
                        </button>

                    </div>

                </div>
            )}

        </div>
    );
}

export default Statement;