import { useEffect, useState } from "react";
import {getCustomers, createCustomer, deleteCustomer} from "../services/customerService";

function Customers() {

    // =====================================================
    // CUSTOMER LIST STATE
    // =====================================================

    const [customers, setCustomers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    // =====================================================
    // CREATE CUSTOMER STATE
    // =====================================================

    const [showForm, setShowForm] = useState(false);

    const [creating, setCreating] = useState(false);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        address: "",
        userName: "",
        password: ""
    });


    // =====================================================
    // LOAD CUSTOMERS
    // =====================================================

    const fetchCustomers = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await getCustomers();

            console.log(
                "Customer API response:",
                response.data
            );

            setCustomers(
                response.data.data || []
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
                    "Failed to fetch customers."
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
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        let cancelled = false;

        const loadInitialCustomers = async () => {

            try {

                setLoading(true);
                setError("");

                const response = await getCustomers();

                console.log(
                    "Customer API response:",
                    response.data
                );

                if (!cancelled) {

                    setCustomers(
                        response.data.data || []
                    );

                }

            } catch (error) {

                console.error(
                    "Customer API error:",
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
                        "You do not have permission to view customers."
                    );

                } else if (error.response) {

                    setError(
                        error.response.data?.message ||
                        "Failed to fetch customers."
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

        loadInitialCustomers();

        return () => {
            cancelled = true;
        };

    }, []);


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
    // CREATE CUSTOMER
    // =====================================================

    const handleCreateCustomer = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        try {

            setCreating(true);

            console.log(
                "Creating customer:",
                formData
            );

            const response = await createCustomer(
                formData
            );

            console.log(
                "Create customer response:",
                response.data
            );

            setSuccess(
                `Customer created successfully. Login Username: ${formData.userName} | Password: ${formData.password}`
            );


            // Clear form

            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                mobile: "",
                address: "",
                userName: "",
                password: ""
            });


            // Hide form

            setShowForm(false);


            // Refresh customer list

            await fetchCustomers();

        } catch (error) {

            console.error(
                "Create customer error:",
                error
            );

            if (error.response?.status === 401) {

                setError(
                    "Your session has expired. Please login again."
                );

            } else if (error.response?.status === 403) {

                setError(
                    "You do not have permission to create customers."
                );

            } else if (error.response) {

                setError(
                    error.response.data?.message ||
                    "Failed to create customer."
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
    // LOADING SCREEN
    // =====================================================

    if (loading) {

        return (
            <div>

                <h1>Customers</h1>

                <p>Loading customers...</p>

            </div>
        );
    }

    const handleDeleteCustomer = async (customerId) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this customer?"
        );

        if (!confirmed) {
            return;
        }

        try {

            setError("");
            setSuccess("");

            await deleteCustomer(customerId);

            setSuccess(
                "Customer deleted successfully."
            );

            await fetchCustomers();

        } catch (error) {

            console.error(
                "Delete customer error:",
                error
            );

            if (error.response?.status === 401) {

                setError(
                    "Your session has expired. Please login again."
                );

            } else if (error.response?.status === 403) {

                setError(
                    "You do not have permission to delete customers."
                );

            } else if (error.response) {

                setError(
                    error.response.data?.message ||
                    "Failed to delete customer."
                );

            } else {

                setError(
                    "Unable to connect to the server."
                );
            }
        }
    };


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div>

            {/* =============================================
                PAGE HEADER
            ============================================== */}

            <div className="section-header">

                <h1>Customers</h1>

                <button
                    type="button"
                    className="primary-button"
                    onClick={() => {

                        setShowForm(!showForm);

                        setError("");
                        setSuccess("");

                    }}
                >

                    {showForm
                        ? "Cancel"
                        : "+ Create Customer"
                    }

                </button>

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
                CREATE CUSTOMER FORM
            ============================================== */}

            {showForm && (

                <div className="customer-form-card">

                    <h2>Create New Customer</h2>

                    <form
                        onSubmit={handleCreateCustomer}
                    >

                        <div className="customer-form-grid">


                            {/* FIRST NAME */}

                            <div className="form-group">

                                <label>
                                    First Name
                                </label>

                                <input
                                    type="text"
                                    name="firstName"
                                    value={
                                        formData.firstName
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter first name"
                                    required
                                />

                            </div>


                            {/* LAST NAME */}

                            <div className="form-group">

                                <label>
                                    Last Name
                                </label>

                                <input
                                    type="text"
                                    name="lastName"
                                    value={
                                        formData.lastName
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter last name"
                                    required
                                />

                            </div>


                            {/* EMAIL */}

                            <div className="form-group">

                                <label>
                                    Email
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={
                                        formData.email
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter email"
                                    required
                                />

                            </div>


                            {/* MOBILE */}

                            <div className="form-group">

                                <label>
                                    Mobile
                                </label>

                                <input
                                    type="text"
                                    name="mobile"
                                    value={
                                        formData.mobile
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter mobile number"
                                    required
                                />

                            </div>


                            {/* ADDRESS */}

                            <div className="form-group full-width">

                                <label>
                                    Address
                                </label>

                                <input
                                    type="text"
                                    name="address"
                                    value={
                                        formData.address
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter address"
                                    required
                                />

                            </div>

                            <div className="form-group">

                                <label>
                                    Username
                                </label>

                                <input
                                    type="text"
                                    name="userName"
                                    value={formData.userName}
                                    onChange={handleChange}
                                    placeholder="Enter customer username"
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Password
                                </label>

                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter customer password"
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
                                : "Create Customer"
                            }

                        </button>

                    </form>

                </div>

            )}


            {/* =============================================
                CUSTOMER LIST
            ============================================== */}

            {!error && (

                <div className="customer-list-section">

                    <h2>Customer List</h2>


                    {customers.length === 0 ? (

                        <p>
                            No customers found.
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
                                        First Name
                                    </th>

                                    <th>
                                        Last Name
                                    </th>

                                    <th>
                                        Email
                                    </th>

                                    <th>
                                        Mobile
                                    </th>

                                    <th>
                                        Address
                                    </th>

                                    <th>
                                        Action
                                    </th>

                                </tr>

                                </thead>


                                <tbody>

                                {customers.map(
                                    (customer) => (

                                        <tr
                                            key={
                                                customer.customerId
                                            }
                                        >

                                            <td>
                                                {
                                                    customer.customerId
                                                }
                                            </td>

                                            <td>
                                                {
                                                    customer.firstName
                                                }
                                            </td>

                                            <td>
                                                {
                                                    customer.lastName
                                                }
                                            </td>

                                            <td>
                                                {
                                                    customer.email
                                                }
                                            </td>

                                            <td>
                                                {
                                                    customer.mobile
                                                }
                                            </td>

                                            <td>
                                                {
                                                    customer.address
                                                }
                                            </td>

                                            <td>

                                                <button
                                                    type="button"
                                                    className="danger-button"
                                                    onClick={() =>
                                                        handleDeleteCustomer(
                                                            customer.customerId
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>

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

export default Customers;