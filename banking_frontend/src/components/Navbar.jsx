import { useNavigate } from "react-router-dom";

function Navbar() {

    const navigate = useNavigate();

    const userName = localStorage.getItem("userName") || "User";
    const role = localStorage.getItem("role") || "";

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        localStorage.removeItem("role");
        localStorage.removeItem("customerId");

        navigate("/login", { replace: true });
    };

    return (
        <header className="navbar">

            <div className="navbar-left">

                <h2>Banking Management System</h2>

            </div>

            <div className="navbar-right">

                <div className="user-info">

                    <span>
                        Welcome, <strong>{userName}</strong>
                    </span>

                    <span className="user-role">
                        Role: <strong>{role}</strong>
                    </span>

                </div>

                <button
                    className="logout-button"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </div>

        </header>
    );
}

export default Navbar;