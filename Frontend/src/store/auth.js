//In the context of Zustand (a state management library for JavaScript), the store refers to a central place where...
//...the state of your application is stored and managed. This store allows different parts of your application to share and update state
import {create} from 'zustand'
import { mountStoreDevtool } from 'simple-zustand-devtools';
import jwt_decode from 'jwt-decode';
import Cookies from "js-cookie";


console.log("initializing STOREEEE")
//This setup creates a simple state management structure where allUserData can be used to store user-related information,..
//...and loading can be used to track whether a process is in progress.
//set and get are utility functions provided by Zustand to interact with the store's state.
const useAuthStore = create((set, get)=>({
    allUserData: null,// this is key
    loading: false,

    //The snippet user: () => { } is an example of a property within an object where the value is an arrow function.
    // eg  console.log(user) Outputs: { user_id: 1, username: 'john_doe' }
    extractUserDetails: () =>({
    user_id : get().allUserData?.user_id || null,
    username: get().allUserData?.username || null,
    }),

    //set, is a function provided by the Zustand store to update the state.
    //set takes an object as an argument. Here, it’s { allUserData: user }
    //This object tells Zustand to update the state where allUserData will be set to whatever value user(parameter) holds.
    setUser:  (user) => set({ allUserData: user }),
    setLoading: (loading) => set({loading}),
    setLoggedIn: () => get().allUserData !== null,

    initializeAuth: () => { 
        const token = Cookies.get('access_token');
        if (token) { 
            const user = jwt_decode(token);
             // Decode token to get user details 
             set({ allUserData: user }); 
            } 
        }
}))

if (import.meta.env.DEV) { mountStoreDevtool('Store', useAuthStore);} 
console.log("STORE FINISHED")

export {useAuthStore}

