import axios from 'axios' 

//Yes, Axios is commonly used for passing data between the server and the frontend
const apiInstance = axios.create({
    baseURL : 'http://127.0.0.1:8000/api/v1/', //endpoint
    timeout : 5000,

    headers:{
        'Content-Type':'application/json',
         Accept:'application/json'
    }
})
//user/token    
//user/register

export default apiInstance