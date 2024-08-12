import apiClient from './api';

export const signup = async (username, password, email) => {
    try{
        const response = await apiClient.post('/signup', { username, password, email });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const login = async (username, password) => {
    try {
        const response = await apiClient.post('/login', { username, password });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const saveWorkoutData = async (username, leftUp, rightUp, repCount) => {
    try {
        const response = await apiClient.post('/save', { username, leftUp, rightUp, repCount });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchSuccessRate = async () => {
    try {
        const response = await apiClient.get('/success-rate');
        return response.data;
    } catch (error) {
        throw error;
    }
};
