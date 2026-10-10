import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);
            setError("");

            const response = await api.post("/auth/login", {
                userName,
                password
            });

            console.log("Login Response:", response.data);

            const loginData = response.data.data;

            // Save authentication details
            localStorage.setItem("token", loginData.token);
            localStorage.setItem("userName", loginData.userName);
            localStorage.setItem("role", loginData.role);

            if (loginData.customerId) {
                localStorage.setItem("customerId", loginData.customerId);
            }

            if (loginData.role === "ADMIN") {
                navigate("/");
            } else if (loginData.role === "CUSTOMER") {
                navigate("/customer-dashboard");
            }

        } catch (error) {

            console.error("Login error", error);

            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError("Invalid username or password");
            }

        } finally {

            setLoading(false);

        }
    };

    return (

        <div className="login-page">

            <div className="login-container">

                {/* LEFT SIDE */}

                <div className="login-brand">

                    <div className="brand-icon">
                        🏦
                    </div>

                    <h1>Banking System</h1>

                    <p>
                        Secure and simple banking management
                        for your everyday financial needs.
                    </p>

                </div>


                {/* LOGIN CARD */}

                <div className="login-card">

                    <div className="login-header">

                        <h2>Welcome Back</h2>

                        <p>
                            Login to your banking account
                        </p>

                    </div>


                    {error && (
                        <div className="login-error">
                            <span>⚠</span>
                            {error}
                        </div>
                    )}


                    <form onSubmit={handleLogin}>

                        <div className="login-form-group">

                            <label htmlFor="username">
                                Username
                            </label>

                            <input
                                id="username"
                                type="text"
                                value={userName}
                                onChange={(e) =>
                                    setUserName(e.target.value)
                                }
                                placeholder="Enter your username"
                                autoComplete="username"
                                required
                            />

                        </div>


                        <div className="login-form-group">

                            <label htmlFor="password">
                                Password
                            </label>

                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                required
                            />

                        </div>


                        <button
                            type="submit"
                            className="login-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Logging in..."
                                : "Log In"
                            }
                        </button>

                    </form>


                    <div className="login-divider">
                        <span></span>
                        <p>Secure Banking</p>
                        <span></span>
                    </div>


                    <div className="login-security">

                        <span>🔒</span>

                        <div>
                            <strong>Secure Login</strong>

                            <p>
                                Your account is protected with
                                JWT authentication.
                            </p>
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;