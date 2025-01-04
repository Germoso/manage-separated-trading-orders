import axiosInstance from '@/config/axios'
import { CreatePositionPayload } from './payload';

export const createPositionRequest = async (positionData: CreatePositionPayload) => {
  try {
    const response = await axiosInstance.post('/position', positionData);
    return response.data;
  } catch (error) {
    console.error('Error creating position request:', error);
    throw error;
  }
};

export const closePositionRequest = async (positionId: string) => {
  try {
    const response = await axiosInstance.post(`/position/close/${positionId}`);
    return response.data;
  } catch (error) {
    console.error('Error closing position request:', error);
    throw error;
  }
};