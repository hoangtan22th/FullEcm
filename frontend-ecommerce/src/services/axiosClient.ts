import axios from 'axios';
import Cookies from 'js-cookie';

const axiosClient = axios.create({
  baseURL: 'https://fakestoreapi.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Trạm xuất cảnh: Lấy thẻ từ Cookie
axiosClient.interceptors.request.use(
  (config) => {
    // Rút thẻ từ Cookie ra (thay vì localStorage)
    const token = Cookies.get('token'); 
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Trạm nhập cảnh: Bắt lỗi 401
axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Thẻ hết hạn -> Hủy thẻ trong Cookie
      Cookies.remove('token');
      window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
