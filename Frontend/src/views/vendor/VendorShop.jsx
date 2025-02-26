import React, { useEffect, useState } from "react";
import VendorSideBar from "./VendorSideBar";
import apiInstance from "../../utils/axios";
import { Link, useParams } from "react-router-dom";

function VendorShop() {
    const [vendorShop, setVendorShop] = useState(null);
    const [products, setProducts] = useState([]);
    const param = useParams();

    useEffect(() => {
        apiInstance.get(`vendor/shop/${param.slug}`)
            .then((res) => {
                console.log("Fetched Data:", res.data);
                setVendorShop(res.data); // ✅ Updating the state
            })
            .catch((error) => console.error("Error fetching vendor shop:", error));
    }, [param.slug]);

    useEffect(() => {
        apiInstance.get(`vendor/shop-product/${param.slug}`)
            .then((res) => {
                console.log("Fetched Products:", res.data);
                setProducts(res.data); // ✅ Updating the state
            })
            .catch((error) => console.error("Error fetching vendor products:", error));
    }, [param.slug]);

    return (
        <>
            <main className="mt-5">
                <div className="container">
                    <section className="text-center container">
                        <div className="row py-lg-5">
                            <div className="col-lg-6 col-md-8 mx-auto">
                                <img 
                                    src={vendorShop?.image || "https://via.placeholder.com/100"} 
                                    style={{ width: 100, height: 100, objectFit: "cover", borderRadius: "50%" }} 
                                    alt="Shop"
                                />
                                <h1 className="fw-light">{vendorShop?.name || "No Name"}</h1>
                                <p className="lead text-muted">{vendorShop?.description || "No Description Available"}</p>
                            </div>
                        </div>
                    </section>

                    <section className="text-center">
                        <h4 className="mb-4">{products.length} Product{products.length !== 1 ? "s" : ""}</h4>
                        <div className="row">
                            {/* Use .map() when products are available */}
                            {products.length > 0 ? (
                                products.map((product) => (
                                    <div key={product.id} className="col-lg-4 col-md-12 mb-4">
                                        <div className="card">
                                            <div className="bg-image hover-zoom ripple" data-mdb-ripple-color="light">
                                                <Link to={`/product/${product.id}`}>
                                                    <img
                                                        src={product.image || "https://via.placeholder.com/300x300"}
                                                        className="w-100"
                                                        style={{ width: "100%", height: "300px", objectFit: "cover" }}
                                                        alt={product.name}
                                                    />
                                                </Link>
                                                <div className="hover-overlay">
                                                    <div
                                                        className="mask"
                                                        style={{ backgroundColor: "rgba(251, 251, 251, 0.15)" }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                <h5 className="card-title">{product.name}</h5>
                                                <p className="card-text">{product.description}</p>
                                                <Link to={`/product/${product.id}`} className="btn btn-primary">View</Link>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No products available</p>
                            )}
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}

export default VendorShop;
