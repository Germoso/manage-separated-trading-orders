import axiosInstance from '@/config/axios';
import { RegisterPayload } from './payload';

export const registerUser = async (userData: RegisterPayload) => {
  try {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};