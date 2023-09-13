import axios from "axios";
import dotenv from 'dotenv'

dotenv.config()

const axiosClient = axios.create({
  baseURL: `${process.env.SERVER_URL}/api`
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
