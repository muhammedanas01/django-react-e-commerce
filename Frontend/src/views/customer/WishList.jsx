import React, { useEffect, useState } from 'react';
import SideBar from './SideBar';
import UserData from '../plugin/UserData';
import apiInstance from '../../utils/axios';
import Swal from 'sweetalert2';

function WishList() {
    const [wishlist, setWishList] = useState([]); // Store wishlist items
    const userData = UserData(); // Get user data

    useEffect(() => {
        // Fetch wishlist items when the component mounts
        if (userData?.user_id) {
            apiInstance.get(`customer/wishlist/${userData.user_id}/`)
                .then((response) => {
                    setWishList(response.data); // Save the wishlist data to state
                })
                .catch((error) => {
                    console.error("Error fetching wishlist:", error);
                });
        }
    }, [userData]);

    const addToWishList = async (product_id, user_id) => {
        try {
            const formdata = new FormData();
            formdata.append("product_id", product_id);
            formdata.append("user_id", user_id);

            const response = await apiInstance.post(`customer/wishlist/${user_id}/`, formdata);
            Swal.fire({
                icon: "success",
                title: response.data.message
            });

            // Refresh the wishlist after adding or removing an item
            apiInstance.get(`customer/wishlist/${user_id}/`)
                .then((response) => {
                    setWishList(response.data);
                });

        } catch (error) {
            console.error("Error updating wishlist:", error);
        }
    };

    return (
        <>
            <main className="mt-5">
                <div className="container">
                    <section>
                        <div className="row">
                            <SideBar />
                            <div className="col-lg-9 mt-1">
                                <section>
                                    <main className="mb-5">
                                        <div className="container">
                                            <section>
                                                <div className="row">
                                                    <h3 className="mb-3">
                                                        <i className="fas fa-heart text-danger" /> Wishlist
                                                    </h3>

                                                    {/* Map through wishlist items */}
                                                    {wishlist.length > 0 ? (
                                                        wishlist.map((item) => (
                                                            <div
                                                                className="col-lg-4 col-md-12 mb-4"
                                                                key={item.id} // Use a unique key
                                                            >
                                                                <div className="card">
                                                                    <div
                                                                        className="bg-image hover-zoom ripple"
                                                                        data-mdb-ripple-color="light"
                                                                    >
                                                                        <img
                                                                            src={item.product.image || "https://www.eclosio.ong/wp-content/uploads/2018/08/default.png"}
                                                                            className="w-100"
                                                                            style={{
                                                                                width: "100px",
                                                                                height: "300px",
                                                                                objectFit: "cover"
                                                                            }}
                                                                            alt={item.product.title}
                                                                        />
                                                                    </div>
                                                                    <div className="card-body">
                                                                        <a href="#" className="text-reset">
                                                                            <h6 className="card-title mb-3">{item.product.title}</h6>
                                                                        </a>
                                                                        <p>{item.product.description}</p>
                                                                        <h6 className="mb-3">${item.product.price}</h6>
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-danger px-3 me-1 mb-1"
                                                                            onClick={() => addToWishList(item.product.id, userData?.user_id)}
                                                                        >
                                                                            <i className="fas fa-heart" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        // Show this if the wishlist is empty
                                                        <h6 className="container text-center" style={{ fontSize: "24px", fontWeight: "bold" }}>
                                                        <i className="fas fa-heart-broken" style={{ fontSize: "48px", color: "#ff4d4d" }}></i> {/* Heartbroken icon */}
                                                        <br />
                                                        Your wishlist is empty
                                                    </h6>
                                                    
                                                    )}
                                                </div>
                                            </section>
                                        </div>
                                    </main>
                                </section>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}

export default WishList;
