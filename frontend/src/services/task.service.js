import axios from "axios";

export const API_URL = process.env.REACT_APP_API_URL;
export const API_BASE_URL = API_URL.replace("/tasks", "");

export const getAllTasks = () => {
    return axios.get(API_URL);
};

export const deleteTask = (id) => {
    return axios.delete(`${API_URL}/${id}`);
};

export const createTask = (formData) => {
    return axios.post(API_URL, formData);
};

export const patchTask = (id) => {
    return axios.patch(`${API_URL}/${id}/status`);
};

export const updateTask = (id, formData) => {
    return axios.put(`${API_URL}/${id}`, formData);
};