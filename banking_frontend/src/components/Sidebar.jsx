
import { Link } from "react-router-dom";

function Sidebar() {

    const role = localStorage.getItem("role");

    return (

        <aside className="sidebar">

            <h3>Banking System</h3>

            <nav>
                <ul>

                    {role === "ADMIN" && (
                        <>
                            <li>
                                <Link to="/">
                                    Dashboard
                                </Link>
                            </li>

                            <li>
                                <Link to="/customers">
                                    Customers
                                </Link>
                            </li>

                            <li>
                                <Link to="/accounts">
                                    Accounts
                                </Link>
                            </li>

                            <li>
                                <Link to="/transactions">
                                    Transactions
                                </Link>
                            </li>

                            <li>
                                <Link to="/statement">
                                    Statements
                                </Link>
                            </li>
                        </>
                    )}

                    {role === "CUSTOMER" && (
                        <>
                            <li>
                                <Link to="/customer-dashboard">
                                    My Dashboard
                                </Link>
                            </li>

                            <li>
                                <Link to="/customer-accounts">
                                    My Accounts
                                </Link>
                            </li>

                            <li>
                                <Link to="/customer-transactions">
                                    My Transactions
                                </Link>
                            </li>

                            <li>
                                <Link to="/customer-statement">
                                    Statement
                                </Link>
                            </li>

                        </>
                    )}

                </ul>
            </nav>

        </aside>
    );
}

export default Sidebar;