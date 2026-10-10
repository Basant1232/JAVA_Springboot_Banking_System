import api from "./api";

export const getAccounts = () => {
    return api.get("/accounts");
};

export const getAccountById = (id) => {
    return api.get(`/accounts/${id}`);
};
export const getMyAccounts = () => {
    return api.get("/accounts/my-accounts");
};

export const createAccount = (account) => {
    return api.post("/accounts", account);
};


export const updateAccount = (id, account) => {
    return api.put(`/accounts/${id}`, account);
};

export const deleteAccount = (id) => {
    return api.delete(`/accounts/${id}`);
};