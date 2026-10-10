import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import { getMyAccounts } from "../services/accountService";

function CustomerStatement() {

    const [searchParams, setSearchParams] = useSearchParams();

    const accountId = searchParams.get("accountId");

    const [accounts, setAccounts] = useState([]);
    const [statement, setStatement] = useState(null);

    const [loadingAccounts, setLoadingAccounts] = useState(true);
    const [loadingStatement, setLoadingStatement] = useState(false);

    const [page, setPage] = useState(0);

    const [error, setError] = useState("");

    // =========================
    // LOAD CUSTOMER ACCOUNTS
    // =========================

    useEffect(() => {

        const loadAccounts = async () => {

            try {

                setLoadingAccounts(true);
                setError("");

                const response = await getMyAccounts();

                console.log(
                    "Statement accounts:",
                    response.data
                );

                const accountList =
                    response.data.data || [];

                setAccounts(accountList);

                // Automatically select first account
                if (!accountId && accountList.length > 0) {

                    setSearchParams({
                        accountId:
                        accountList[0].accountId
                    });

                }

            } catch (error) {

                console.error(
                    "Statement accounts error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load accounts"
                );

            } finally {

                setLoadingAccounts(false);

            }
        };

        loadAccounts();

    }, []);


    // =========================
    // LOAD STATEMENT
    // =========================

    useEffect(() => {

        if (!accountId) {
            return;
        }

        const loadStatement = async () => {

            try {

                setLoadingStatement(true);
                setError("");

                const response = await api.get(
                    `/transactions/account/${accountId}/statement`,
                    {
                        params: {
                            page: page,
                            size: 10
                        }
                    }
                );

                console.log(
                    "Customer statement:",
                    response.data
                );

                setStatement(
                    response.data.data
                );

            } catch (error) {

                console.error(
                    "Customer statement error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load statement"
                );

                setStatement(null);

            } finally {

                setLoadingStatement(false);

            }
        };

        loadStatement();

    }, [accountId, page]);


    // =========================
    // ACCOUNT CHANGE
    // =========================

    const handleAccountChange = (event) => {

        const selectedAccountId =
            event.target.value;

        setPage(0);

        setStatement(null);

        setSearchParams({
            accountId: selectedAccountId
        });
    };


    // =========================
    // LOADING ACCOUNTS
    // =========================

    if (loadingAccounts) {

        return (
            <div className="dashboard-page">

                <h1>Account Statement</h1>

                <p>
                    Loading accounts...
                </p>

            </div>
        );
    }


    // =========================
    // NO ACCOUNTS
    // =========================

    if (accounts.length === 0) {

        return (
            <div className="dashboard-page">

                <h1>Account Statement</h1>

                <div className="dashboard-section">

                    <p>
                        No accounts found.
                    </p>

                </div>

            </div>
        );
    }


    return (

        <div className="dashboard-page">

            <h1>Account Statement</h1>


            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}


            {/* =========================
                ACCOUNT SELECTOR
            ========================= */}

            <div className="dashboard-section">

                <label>
                    <strong>
                        Select Account
                    </strong>
                </label>

                <br />

                <select
                    value={accountId || ""}
                    onChange={handleAccountChange}
                >

                    <option value="" disabled>
                        Select an account
                    </option>

                    {accounts.map((account) => (

                        <option
                            key={account.accountId}
                            value={account.accountId}
                        >
                            {account.accountNumber}
                            {" - "}
                            {account.accountType}
                        </option>

                    ))}

                </select>

            </div>


            {/* =========================
                LOADING STATEMENT
            ========================= */}

            {loadingStatement && (

                <div className="dashboard-section">

                    <p>
                        Loading statement...
                    </p>

                </div>

            )}


            {/* =========================
                STATEMENT
            ========================= */}

            {!loadingStatement && statement && (

                <>

                    {/* ACCOUNT INFORMATION */}

                    <div className="dashboard-section">

                        <h2>
                            Account Information
                        </h2>

                        <p>
                            <strong>
                                Account Number:
                            </strong>{" "}
                            {statement.accountNumber}
                        </p>

                    </div>


                    {/* CARDS */}

                    <div className="dashboard-cards">

                        <div className="dashboard-card">

                            <h2>
                                Current Balance
                            </h2>

                            <p>
                                ₹
                                {Number(
                                    statement.currentBalance || 0
                                ).toFixed(2)}
                            </p>

                        </div>


                        <div className="dashboard-card">

                            <h2>
                                Total Transactions
                            </h2>

                            <p>
                                {statement.totalTransactions}
                            </p>

                        </div>


                        <div className="dashboard-card">

                            <h2>
                                Page
                            </h2>

                            <p>
                                {statement.currentPage + 1}
                                {" / "}
                                {statement.totalPages}
                            </p>

                        </div>

                    </div>


                    {/* TRANSACTION TABLE */}

                    <div className="dashboard-section">

                        <h2>
                            Transaction Statement
                        </h2>


                        {statement.transactions?.length === 0 ? (

                            <p>
                                No transactions found.
                            </p>

                        ) : (

                            <table className="data-table">

                                <thead>

                                <tr>

                                    <th>
                                        Type
                                    </th>

                                    <th>
                                        Amount
                                    </th>

                                    <th>
                                        Date
                                    </th>

                                    <th>
                                        Remarks
                                    </th>

                                </tr>

                                </thead>


                                <tbody>

                                {statement.transactions.map(
                                    (transaction) => (

                                        <tr
                                            key={
                                                transaction.transactionId
                                            }
                                        >

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

                                    )
                                )}

                                </tbody>

                            </table>

                        )}

                    </div>


                    {/* PAGINATION */}

                    <div className="pagination">

                        <button
                            disabled={statement.firstPage}
                            onClick={() =>
                                setPage(page - 1)
                            }
                        >
                            Previous
                        </button>


                        <span>

                            Page{" "}
                            {statement.currentPage + 1}
                            {" "}of{" "}
                            {statement.totalPages}

                        </span>


                        <button
                            disabled={statement.lastPage}
                            onClick={() =>
                                setPage(page + 1)
                            }
                        >
                            Next
                        </button>

                    </div>

                </>
            )}

        </div>
    );
}

export default CustomerStatement;