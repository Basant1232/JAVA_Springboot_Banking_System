import api from "./api";

export const deposit = (transaction) => {
    return api.post("/transactions/deposit", transaction);
};

export const withdraw = (transaction) => {
    return api.post("/transactions/withdraw", transaction);
};

export const getMyTransactions = () => {
    return api.get("/transactions/my-transactions");
};

export const transfer = (transfer) => {
    return api.post("/transactions/transfer", transfer);
};

export const getTransactionsByAccount = (accountId) => {
    return api.get(`/transactions/account/${accountId}`);
};

export const getStatement = (accountId, page = 0, size = 10) => {
    return api.get(
        `/transactions/account/${accountId}/statement`,
        {
            params: {
                page,
                size
            }
        }
    );
};