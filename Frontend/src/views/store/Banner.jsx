import React from 'react';
import "../Style/BannerStyle.css"; 

function Banner({ title, subtitle, backgroundImage }) {
    return (
        <div 
            className="banner-container d-flex justify-content-center align-items-center text-center" 
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "300px", // Adjust as needed
                color: "white"
            }}
        >
        </div>
    );
}

export default Banner;
