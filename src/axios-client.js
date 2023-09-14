import axios from "axios";

const serverApi = import.meta.env.SERVER_API_BASE_URL
console.log(import.meta.env.VITE_API_BASE_URL);

const axiosClient = axios.create({
  baseURL: `${serverApi}/api`
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
