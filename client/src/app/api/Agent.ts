import axios, { AxiosResponse } from 'axios';
import { Weather } from '../models/Weather';

axios.defaults.baseURL = 'https://localhost:44329';

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
}

const Activities = {
    list: () => requests.get<Weather[]>('/Activities'),
    details: (id: string) => requests.get<Weather>(`/Activities/${id}`),
    create: (activity: Weather) => requests.post<void>('/Activities', activity),
    update: (activity: Weather) => requests.put<void>(`/Activities/${activity.city}`, activity),
    delete: (id: string) => requests.del<void>(`/Activities/${id}`),
}

const agent = {
    Activities
}

export default agent;
