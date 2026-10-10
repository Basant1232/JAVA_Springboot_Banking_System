import { useState } from "react";
import {
    deposit,
    withdraw,
    transfer
} from "../services/transactionService";

function Transactions() {

    const [accountId, setAccountId] = useState("");
    const [transactionAmount, setTransactionAmount] = useState("");
    const [transferAmount, setTransferAmount] = useState("");
    const [remarks, setRemarks] = useState("");

    const [fromAccountId, setFromAccountId] = useState("");
    const [toAccountId, setToAccountId] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [processing, setProcessing] = useState(false);

    const clearMessages = () => {
        setMessage("");
        setError("");
    };

    const validateAmount = (amount) => {
        if (!amount || Number(amount) <= 0) {
            setError("Amount must be greater than 0");
            return false;
        }

        return true;
    };

    const handleDeposit = async () => {

        clearMessages();

        if (!accountId) {
            setError("Account ID is required");
            return;
        }

        if (!validateAmount(transactionAmount)) {
            return;
        }

        try {

            setProcessing(true);

            const response = await deposit({
                accountId: Number(accountId),
                transactionType: "DEPOSIT",
                amount: Number(transactionAmount),
                remarks: remarks
            });

            setMessage(response.data.message);

        } catch (error) {

            console.error("Deposit error:", error);

            if (error.response?.status === 401) {
                setError("Your session has expired. Please login again.");
            } else if (error.response?.status === 403) {
                setError("You do not have permission to perform this transaction.");
            } else {
                setError(
                    error.response?.data?.message ||
                    "Deposit failed"
                );
            }

        } finally {

            setProcessing(false);

        }
    };
    const handleWithdraw = async () => {

        clearMessages();

        if (!accountId) {
            setError("Account ID is required");
            return;
        }

        if (!validateAmount(transactionAmount)) {
            return;
        }

        try {

            setProcessing(true);

            const response = await withdraw({
                accountId: Number(accountId),
                transactionType: "WITHDRAW",
                amount: Number(transactionAmount),
                remarks: remarks
            });

            setMessage(response.data.message);

        } catch (error) {

            console.error("Withdraw error:", error);

            if (error.response?.status === 401) {
                setError("Your session has expired. Please login again.");
            } else if (error.response?.status === 403) {
                setError("You do not have permission to perform this transaction.");
            } else {
                setError(
                    error.response?.data?.message ||
                    "Withdrawal failed"
                );
            }

        } finally {

            setProcessing(false);

        }
    };

    const handleTransfer = async () => {

        clearMessages();

        if (!fromAccountId || !toAccountId) {
            setError("Both account IDs are required");
            return;
        }

        if (fromAccountId === toAccountId) {
            setError("From and To accounts cannot be the same");
            return;
        }

        if (!validateAmount(transferAmount)) {
            return;
        }

        try {

            setProcessing(true);

            const response = await transfer({
                fromAccountId: Number(fromAccountId),
                toAccountId: Number(toAccountId),
                amount: Number(transferAmount)
            });

            setMessage(response.data.message);

        } catch (error) {

            console.error("Transfer error:", error);

            if (error.response?.status === 401) {
                setError("Your session has expired. Please login again.");
            } else if (error.response?.status === 403) {
                setError("You do not have permission to perform this transaction.");
            } else {
                setError(
                    error.response?.data?.message ||
                    "Transfer failed"
                );
            }

        } finally {

            setProcessing(false);

        }
    };

    return (
        <div className="transactions-page">

            <h1>Transactions</h1>

            {message && (
                <p className="success-message">
                    {message}
                </p>
            )}

            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}
            {/* Deposit / Withdraw */}

            <section className="transaction-card">




            <h2>Deposit / Withdraw</h2>

            <div className="form-group">
                <label>Account ID: </label>

                <input
                    type="number"
                    value={accountId}
                    onChange={(e) =>
                        setAccountId(e.target.value)}
                />
            </div>

            <br />

            <div className="form-group">
                <label>Amount: </label>

                <input
                    type="number"
                    value={transactionAmount}
                    onChange={(e) =>
                        setTransactionAmount(e.target.value)}
                />
            </div>

            <br />

            <div className="form-group">
                <label>Remarks: </label>

                <input
                    type="text"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                />
            </div>

            <br />

                <button
                    className="primary-button" onClick={handleDeposit} disabled={processing}>
                    {processing ? "Processing..." : "Deposit"}
                </button>
            {" "}

                <button className="primary-button" onClick={handleWithdraw} disabled={processing}>
                    {processing ? "Processing..." : "Withdraw"}
                </button>

            </section>



            {/* Transfer */}

            <section className="transaction-card">

            <h2>Transfer</h2>

            <div className="form-group">

                <label>From Account ID: </label>

                <input
                    type="number"
                    value={fromAccountId}
                    onChange={(e) =>
                        setFromAccountId(e.target.value)
                    }
                />
            </div>

            <br />

            <div className="form-group">

                <label>To Account ID: </label>

                <input
                    type="number"
                    value={toAccountId}
                    onChange={(e) =>
                        setToAccountId(e.target.value)
                    }
                />
            </div>

            <br />

            <div className="form-group">

                <label>Transfer Amount: </label>

                <input
                    type="number"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                />
            </div>

            <br />

                <button className="primary-button" onClick={handleTransfer} disabled={processing}>
                    {processing ? "Processing..." : "Transfer"}
                </button>

                </section>

        </div>
    );
}

export default Transactions;