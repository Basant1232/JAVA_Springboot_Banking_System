import { useEffect, useState } from "react";
import {
    getAccounts,
    getMyAccounts,
    createAccount
} from "../services/accountService";

import { getCustomers } from "../services/customerService";

function Accounts() {

    // =====================================================
    // ACCOUNT LIST STATE
    // =====================================================

    const [accounts, setAccounts] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    // =====================================================
    // CREATE ACCOUNT STATE
    // =====================================================

    const [showForm, setShowForm] = useState(false);

    const [creating, setCreating] = useState(false);

    const [customers, setCustomers] = useState([]);

    const [formData, setFormData] = useState({
        customerId: "",
        accountType: "SAVINGS",
        balance: ""
    });


    // =====================================================
    // ROLE
    // =====================================================

    const role = localStorage.getItem("role");

    const isAdmin = role === "ADMIN";

    const isCustomer = role === "CUSTOMER";


    // =====================================================
    // LOAD ACCOUNTS
    // =====================================================

    const fetchAccounts = async () => {

        try {

            setLoading(true);
            setError("");

            const response = isAdmin
                ? await getAccounts()
                : await getMyAccounts();

            console.log(
                "Account API response:",
                response.data
            );

            setAccounts(
                response.data?.data || []
            );

        } catch (error) {

            console.error(
                "Account API error:",
                error
            );

            if (error.response?.status === 401) {

                setError(
                    "Your session has expired. Please login again."
                );

            } else if (error.response?.status === 403) {

                setError(
                    "You do not have permission to view accounts."
                );

            } else if (error.response) {

                setError(
                    error.response.data?.message ||
                    "Failed to fetch accounts."
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


    // =====================================================
    // LOAD CUSTOMERS
    // ADMIN ONLY
    // =====================================================

    const fetchCustomers = async () => {

        if (!isAdmin) {
            return;
        }

        try {

            const response = await getCustomers();

            console.log(
                "Customers for account creation:",
                response.data
            );

            setCustomers(
                response.data?.data || []
            );

        } catch (error) {

            console.error(
                "Customer API error:",
                error
            );

            if (error.response?.status === 401) {

                setError(
                    "Your session has expired. Please login again."
                );

            } else if (error.response?.status === 403) {

                setError(
                    "You do not have permission to view customers."
                );

            } else if (error.response) {

                setError(
                    error.response.data?.message ||
                    "Failed to load customers."
                );

            } else {

                setError(
                    "Unable to connect to the server."
                );
            }
        }
    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        let cancelled = false;

        const loadInitialData = async () => {

            try {

                setLoading(true);
                setError("");

                const accountResponse = isAdmin
                    ? await getAccounts()
                    : await getMyAccounts();

                if (!cancelled) {

                    setAccounts(
                        accountResponse.data?.data || []
                    );

                }

            } catch (error) {

                console.error(
                    "Account API error:",
                    error
                );

                if (cancelled) {
                    return;
                }

                if (error.response?.status === 401) {

                    setError(
                        "Your session has expired. Please login again."
                    );

                } else if (error.response?.status === 403) {

                    setError(
                        "You do not have permission to view accounts."
                    );

                } else if (error.response) {

                    setError(
                        error.response.data?.message ||
                        "Failed to fetch accounts."
                    );

                } else {

                    setError(
                        "Unable to connect to the server. Please make sure the backend is running."
                    );
                }

            } finally {

                if (!cancelled) {
                    setLoading(false);
                }

            }
        };

        loadInitialData();

        return () => {
            cancelled = true;
        };

    }, [isAdmin]);


    // =====================================================
    // HANDLE FORM INPUT
    // =====================================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };


    // =====================================================
    // OPEN CREATE ACCOUNT FORM
    // =====================================================

    const handleOpenForm = async () => {

        setShowForm(!showForm);

        setError("");
        setSuccess("");

        if (!showForm) {

            await fetchCustomers();

        }

    };


    // =====================================================
    // CREATE ACCOUNT
    // =====================================================

    const handleCreateAccount = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        if (!formData.customerId) {

            setError(
                "Please select a customer."
            );

            return;
        }

        if (!formData.accountType) {

            setError(
                "Please select an account type."
            );

            return;
        }

        if (
            formData.balance === "" ||
            Number(formData.balance) < 0
        ) {

            setError(
                "Initial balance cannot be negative."
            );

            return;
        }

        try {

            setCreating(true);

            const response = await createAccount({

                customerId: Number(
                    formData.customerId
                ),

                accountType:
                formData.accountType,

                balance: Number(
                    formData.balance
                )

            });

            console.log(
                "Create account response:",
                response.data
            );

            setSuccess(
                response.data?.message ||
                "Account created successfully."
            );


            // Clear form

            setFormData({
                customerId: "",
                accountType: "SAVINGS",
                balance: ""
            });


            // Hide form

            setShowForm(false);


            // Refresh accounts

            await fetchAccounts();

        } catch (error) {

            console.error(
                "Create account error:",
                error
            );

            if (error.response?.status === 401) {

                setError(
                    "Your session has expired. Please login again."
                );

            } else if (error.response?.status === 403) {

                setError(
                    "You do not have permission to create accounts."
                );

            } else if (error.response) {

                setError(
                    error.response.data?.message ||
                    "Failed to create account."
                );

            } else {

                setError(
                    "Unable to connect to the server. Please make sure the backend is running."
                );
            }

        } finally {

            setCreating(false);

        }
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <div>

                <h1>Accounts</h1>

                <p>Loading accounts...</p>

            </div>
        );
    }


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div>

            {/* =============================================
                PAGE HEADER
            ============================================== */}

            <div className="section-header">

                <h1>Accounts</h1>

                {isAdmin && (

                    <button
                        type="button"
                        className="primary-button"
                        onClick={handleOpenForm}
                    >

                        {showForm
                            ? "Cancel"
                            : "+ Create Account"
                        }

                    </button>

                )}

            </div>


            {/* =============================================
                SUCCESS MESSAGE
            ============================================== */}

            {success && (

                <p className="success-message">

                    {success}

                </p>

            )}


            {/* =============================================
                ERROR MESSAGE
            ============================================== */}

            {error && (

                <p className="error-message">

                    {error}

                </p>

            )}


            {/* =============================================
                CREATE ACCOUNT FORM
            ============================================== */}

            {showForm && isAdmin && (

                <div className="customer-form-card">

                    <h2>
                        Create New Account
                    </h2>

                    <form
                        onSubmit={
                            handleCreateAccount
                        }
                    >

                        <div className="customer-form-grid">


                            {/* CUSTOMER */}

                            <div className="form-group">

                                <label>
                                    Customer
                                </label>

                                <select
                                    name="customerId"
                                    value={
                                        formData.customerId
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                >

                                    <option value="">
                                        Select Customer
                                    </option>

                                    {customers.map(
                                        (customer) => (

                                            <option
                                                key={
                                                    customer.customerId
                                                }
                                                value={
                                                    customer.customerId
                                                }
                                            >

                                                {customer.firstName}{" "}
                                                {customer.lastName}
                                                {" - ID: "}
                                                {
                                                    customer.customerId
                                                }

                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            {/* ACCOUNT TYPE */}

                            <div className="form-group">

                                <label>
                                    Account Type
                                </label>

                                <select
                                    name="accountType"
                                    value={
                                        formData.accountType
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                >

                                    <option value="SAVINGS">
                                        Savings
                                    </option>

                                    <option value="CURRENT">
                                        Current
                                    </option>

                                </select>

                            </div>


                            {/* INITIAL BALANCE */}

                            <div className="form-group">

                                <label>
                                    Initial Balance
                                </label>

                                <input
                                    type="number"
                                    name="balance"
                                    value={
                                        formData.balance
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter initial balance"
                                    min="0"
                                    step="0.01"
                                    required
                                />

                            </div>

                        </div>


                        {/* CREATE BUTTON */}

                        <button
                            type="submit"
                            className="primary-button"
                            disabled={creating}
                        >

                            {creating
                                ? "Creating..."
                                : "Create Account"
                            }

                        </button>

                    </form>

                </div>

            )}


            {/* =============================================
                ACCOUNT LIST
            ============================================== */}

            {!error && (

                <div className="customer-list-section">

                    <h2>
                        Account List
                    </h2>


                    {accounts.length === 0 ? (

                        <p>

                            {isCustomer
                                ? "You do not have any accounts yet."
                                : "No accounts found."
                            }

                        </p>

                    ) : (

                        <div className="table-container">

                            <table className="data-table">

                                <thead>

                                <tr>

                                    <th>
                                        ID
                                    </th>

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
                                        Customer ID
                                    </th>

                                    <th>
                                        Customer Name
                                    </th>

                                </tr>

                                </thead>


                                <tbody>

                                {accounts.map(
                                    (account) => (

                                        <tr
                                            key={
                                                account.accountId
                                            }
                                        >

                                            <td>
                                                {
                                                    account.accountId
                                                }
                                            </td>

                                            <td>
                                                {
                                                    account.accountNumber
                                                }
                                            </td>

                                            <td>
                                                {
                                                    account.accountType
                                                }
                                            </td>

                                            <td>
                                                ₹
                                                {Number(
                                                    account.balance || 0
                                                ).toFixed(2)}
                                            </td>

                                            <td>
                                                {
                                                    account.customerId
                                                }
                                            </td>

                                            <td>
                                                {
                                                    account.customerName
                                                }
                                            </td>

                                        </tr>

                                    )
                                )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            )}

        </div>
    );
}

export default Accounts;