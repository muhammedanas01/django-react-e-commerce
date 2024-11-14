import axios from 'axios'
import {isAccessTokenExpired, setAuthUser,getAccessToken } from './auth'
import {BASE_URL} from './constants'
import Cookies from "js-cookie"

const useAxios = async () => {
    const access_token = Cookies.get('access_token')
    const refresh_token = Cookies.get('refresh_token')

    axiosInstance = axios.create({
        baseURL: BASE_URL,
        headers: {Authorization: `Bearer${access_token}`}
    })
    //The interceptor captures the request before it is sent.
    //If the access token is not expired, the request proceeds as is.
    //If the access token is expired, it refreshes the token and updates the request with the new token, ensuring the request is authorized correctly.
    axiosInstance.interceptors.request.use(async(request) => {
        if (!isAccessTokenExpired(access_token)){ //if not expired
            return request
        }
        const response = await getAccessToken(refresh_token)//refresh the acces token
        setAuthUser(response.access, response.request)//updates the access token

        request.headers.Authorization = `Bearer${response.data.access}`
        return request
    })

    return axiosInstance
 
}

export default useAxios


//Initial Setup: Login using a basic Axios request to obtain and store tokens.

//Maintaining Tokens: after initial setup Use useAxios to manage tokens and include them in request headers across your application, 
//ensuring all subsequent API requests are authenticated and handling token expiration automatically.

//By using the useAxios setup with interceptors, you consistently verify and manage the access token for all... 
//..subsequent requests after the initial authentication. This ensures that each request is authenticated and indeed made by the same user.
// It keeps your application secure and ensures that user-specific actions and data are properly handled.