import { useAuthStore } from "../store/auth";
import axios from "./axios";
import jwt_decode from "jwt-decode";
import Cookies from "js-Cookie";

export const login = async (email, password) => {
  try {
    // here we are passing the email and password to endpoint/user/token(in server in this view login is configured.)
    //response is an object that contains various pieces of information, including the data sent by the server and the status of the request.
    const response = await axios.post("user/token", { email, password });
    console.log("this response:", response)
    // Destructuring the response to extract data and status
    const { data, status } = response;

    // 200 = request was successfull
    // data.access and data.refresh: is the access and refresh token received from the server. if we decode token it will be user credentials.//after login both token will be in browser cookies.
    //setAuthUser is a manually configerd function
    if (status === 200 && data) {
      setAuthUser(data.access, data.refresh);
    }
    return { data, error: null };
    
  } catch (error) {
    return {
      data: null,
      error
      // //error: error.response.data
      //   ? error.response.data.detail
      //   : "something went wrong",
    };
  }
};

export const register = async (
  full_name,
  email,
  phone_number,
  password,
  password2
) => {
  try {
    // here we are passing the email,password,email and phone to endpoint/user/register(in server in this view signup is configured.)
    const { data } = await axios.post("user/register", {
      full_name,
      email,
      phone_number,
      password,
      password2,
    });

    // here we are directly logging in user after signup.
    await login(email, password);

    //for alert

    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error
      // error: error.response.data
      //   ? error.response.data.detail
      //   : "something went wrong",
    };
  }
};

//getState() is a built-in method to retrieve the current state of the store
export const logout = () => {
  Cookies.remove("access_token");
  Cookies.remove("refresh_token");
  useAuthStore.getState().setUser(null);

  // alert
};

// this function sets a user when loggedIn and Validates tokens and refreshes if needed
export const setUser = async () => {
  const accessToken = Cookies.get("access_token");
  const refreshToken = Cookies.get("refresh_token");
  //if not        or
  if (!accessToken || refreshToken) {
    return; //returns null
  }
  //checks if  access token is expired
  if (isAccessTokenExpired(accessToken)) {
    const response = await getAccessToken(refreshToken); // refresh token is used to obtain new access token.
    setAuthUser(response.access, response.refresh);
    //if token is not expired
  } else {
    setAuthUser(accessToken, refreshToken);
  }
};

//this function Decodes tokens, stores them, and updates the Zustand store.
//If the access token is expired new access token is stored in cookies obtained by getAccessToken. thats why we again set cookies here.
export const setAuthUser = (access_token, refresh_token) => {
  //'access_token': the key for the access token cookie.
  // access_token: The value of the access token.
  // secure: Ensures that the cookies are only sent over secure HTTPS connections
  Cookies.set("access_token", access_token, {
    expires: 1,
    secure: true,
  });

  Cookies.set("refresh_token", refresh_token, {
    expires: 7,
    secure: true,
  });

  //jwt_decode: This function decodes the JSON Web Token (JWT) to extract the user information
  //ensures that if jwt_decode(access_token) returns null or undefined, if null user = null, else user = user credential obj.
  const user = jwt_decode(access_token) ?? null;

  // setUser is manualy configured function in {useAuthStore}'../store/auth'
  // if user it update user in zustand
  if (user) {
    useAuthStore.getState().setUser(user);
  }

  //setLoading is manualy configured function in {useAuthStore}'../store/auth'
  useAuthStore.getState().setLoading(false);
};

export const getAccessToken = async () => {
  const refresh_token = Cookies.get("refresh_token");
  const response = await axios.post("user/token/refresh/", {
    //in this url the view for token refresh is configured
    newRefreshToken: refresh_token,
  });
  return response.data; // it returns both refresh and access tokens.
};

export const isAccessTokenExpired = (accessToken) => {
  try {
    const decodedToken = jwt_decode(accessToken);
    return decodedToken.exp < Date.now() / 100; // checks if access token is less than date.now(), only return if is less.
  } catch (error) {
    console.log("error from isAccessExpired", error);
    return true;
  }
};
