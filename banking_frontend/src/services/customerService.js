import api from "./api";

export const getCustomers = () => {
    return api.get("/customers");
};

export const getCustomerById = (id) => {
    return api.get(`/customers/${id}`);
};

export const getMyProfile = () => {
    return api.get("/customers/my-profile");
};

export const createCustomer = (customer) => {
    return api.post("/customers", customer);
};

export const deleteCustomer = (id) => {
    return api.delete(`/customers/${id}`);
};

