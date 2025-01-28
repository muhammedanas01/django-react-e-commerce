//In the context of Zustand (a state management library for JavaScript), the store refers to a central place where...
//...the state of your application is stored and managed. This store allows different parts of your application to share and update state
import {create} from 'zustand'
import { mountStoreDevtool } from 'simple-zustand-devtools';
import jwt_decode from 'jwt-decode';
import Cookies from "js-cookie";



//This setup creates a simple state management structure where "allUserData" can be used to store user-related information,..
//...and loading can be used to track whether a process is in progress.
//set and get are utility functions provided by Zustand to interact with the store's state.
const useAuthStore = create((set, get)=>({
    allUserData: null,// this is key
    loading: false,

    //The snippet extractUserDetails: () => { } is an example of a property within an object where the value is an arrow function.
    // eg  console.log(extractUserDetails) Outputs: { user_id: 1, username: 'john_doe' }
    extractUserDetails: () =>({
    user_id : get().allUserData?.user_id || null,
    username: get().allUserData?.username || null,
    }),

    //set, is a function provided by the Zustand store to update the state.
    //set takes an object as an argument. Here, it’s { allUserData: user }
    //This object tells Zustand to update the state where allUserData will be set to whatever value user(parameter) holds.
    setUser:  (user) => set({ allUserData: user }),

    //This is a setter function used to update the loading state in the store.
    setLoading: (loading) => set({ loading }),
    
    //checks whether the user is logged in by evaluating if allUserData is null.
    setLoggedIn: () => get().allUserData !== null,
    
    initializeAuth: () => { 
        set({ loading: true });
        const token = Cookies.get('access_token');
        if (token) { 
            const user = jwt_decode(token);
             // Decode token to get user details 
             set({ allUserData: user, loading:false });   
            } else {
                set({ allUserData: null, loading: false });
            }
        }
}))


if (import.meta.env.DEV) { mountStoreDevtool('Store', useAuthStore);} 


export {useAuthStore}

