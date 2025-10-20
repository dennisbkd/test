import axios from "axios";

 const instancia = axios.create({
  baseURL: 'https://test-lime-phi-57.vercel.app',
  withCredentials: true
})

instancia.interceptors.request.use((config)=>{
  const token = localStorage.getItem('token')
  if(token){
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
},
(error)=> Promise.reject(error)
)

export default instancia