import { useEffect, useState } from "react";
import { setUser } from "../utils/auth";
import React from "react";
import { useNavigate} from "react-router-dom";

/**
 * MainWrapper prevents access to components until the `setUser` task is completed,
 * or in other words, until the authentication state finishes loading.
 * MainWrapper itself does not enforce authentication—it only delays.. 
 * ..rendering until loading is false.
 */
const MainWrapper = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        const initializeAuth = async () => {
            setLoading(true); // Set loading to true while initializing
            const isUserSet = await setUser(); // Check if the user was set or  Perform the user authentication task
            setLoading(false); // Set loading to false after completing
        };

        initializeAuth(); // Call the function
    }, []); // Run this effect only once when the component mounts

    // Render children only after loading is complete
    return <>{loading ? null : children}</>;
};

export default MainWrapper;
