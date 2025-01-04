import axiosInstance from './axios';

export const swrFetcher = (url: string) => axiosInstance.get(url).then(res => res.data);
