import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: process.env.REACT_APP_PITCH_SWITCH_BACKEND_URL,
  timeout: 10000,
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      toast.error(`Server error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
    } else if (error.request) {
      toast.error("No response from the server. Check Your internet connection.");
    } else {
      toast.error(`Bad Request: ${error.message}`);
    }
    return Promise.reject(error);
  }
);

export default api;