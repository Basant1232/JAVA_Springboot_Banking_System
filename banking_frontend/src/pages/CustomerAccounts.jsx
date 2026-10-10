import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyAccounts } from "../services/accountService";

function CustomerAccounts() {

    const navigate = useNavigate();

    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const loadAccounts = async () => {

            try {

                setLoading(true);
                setError("");

                const response = await getMyAccounts();

                console.log("My accounts:", response.data);

                setAccounts(response.data.data || []);

            } catch (error) {

                console.error(
                    "Customer accounts error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load accounts"
                );

            } finally {

                setLoading(false);

            }
        };

        loadAccounts();

    }, []);


    if (loading) {

        return (
            <div className="dashboard-page">

                <h1>My Accounts</h1>

                <p>Loading accounts...</p>

            </div>
        );
    }


    return (

        <div className="dashboard-page">

            <h1>My Accounts</h1>


            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}


            {accounts.length === 0 ? (

                <div className="dashboard-section">

                    <p>
                        No accounts found.
                    </p>

                </div>

            ) : (

                <div className="dashboard-section">

                    <table className="data-table">

                        <thead>

                        <tr>

                            <th>
                                Account Number
                            </th>

                            <th>
                                Account Type
                            </th>

                            <th>
                                Balance
                            </th>

                            <th>
                                Action
                            </th>

                        </tr>

                        </thead>


                        <tbody>

                        {accounts.map((account) => (

                            <tr
                                key={account.accountId}
                            >

                                <td>
                                    {account.accountNumber}
                                </td>


                                <td>
                                    {account.accountType}
                                </td>


                                <td>
                                    ₹
                                    {Number(
                                        account.balance || 0
                                    ).toFixed(2)}
                                </td>


                                <td>

                                    <button
                                        className="view-button"
                                        onClick={() =>
                                            navigate(
                                                `/customer-statement?accountId=${account.accountId}`
                                            )
                                        }
                                    >
                                        View Statement
                                    </button>

                                </td>

                            </tr>

                        ))}

                        </tbody>

                    </table>

                </div>

            )}

        </div>
    );
}

export default CustomerAccounts;