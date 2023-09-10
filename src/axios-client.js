import axios from "axios";

const axiosClient = axios.create({
  baseURL: `http://192.168.1.7:3000/api`
})

axiosClient.interceptors.request.use((config) => {
  const token = window.localStorage.getItem('ACCESS_TOKEN');
  config.headers.Authorization = `Bearer ${token}`
  return config;
})

axiosClient.interceptors.response.use((response) => {
  return response
}, (error) => {
  const {response} = error;
  if (response.status === 401) {
    window.localStorage.removeItem('ACCESS_TOKEN')
    // window.location.reload();
  } else if (response.status === 404) {
    //Show not found
  }

  throw error;
})

export default axiosClient