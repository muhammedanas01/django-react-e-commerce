import React, { useEffect, useState } from "react";
import apiInstance from "../../utils/axios";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2'

import useCurrentAddress from "../plugin/UserCountry";
import UserData from "../plugin/UserData";
import CartID from "../plugin/CartId";

import "../Style/product-card-btn.css";

const Toast = Swal.mixin({
  toast:true,
  position:"top",
  timer:1500,
  timerProgressBar: true
})

function Products() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [colorValue, setColorValue] = useState("No Color");
  const [sizeValue, setSizeValue] = useState("No Size");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState({});
  const [selectedSize, setSelectedSize] = useState({});

  const currentAddress = useCurrentAddress();
  const userData = UserData();
  const cartId = CartID();

  // when adding to cart from list of products there no input given for quantity so it is assigned into defaultQuantity
  const default_quantity = 1;

  const handleColorButtonClick = (event, product_id, colorName) => {
    setColorValue(colorName);
    setSelectedProduct(product_id);

    setSelectedColor((previousSelectedColor) => ({
      // previousselected color has the value of selectedColor, it's provided by setSelectedColor
      ...previousSelectedColor, //Copy all previous entries into a new object
      [product_id]: colorName, // If product_id is the same as an existing key, the new key-value pair [product_id]: colorName updates the value for that key. or If product_id is a new key, it adds the key-value pair to the new object.
    }));
  };

  const handleSizeButtonClick = (event, product_id, sizeName) => {
    setSizeValue(sizeName);
    setSelectedProduct(product_id);

    setSelectedSize((previousSelectedSize) => ({
      // previousselected color has the value of selectedColor, it's provided by setSelectedColor
      ...previousSelectedSize, //Copy all previous entries into a new object
      [product_id]: sizeName, // If product_id is the same as an existing key, the new key-value pair [product_id]: colorName updates the value for that key. or If product_id is a new key, it adds the key-value pair to the new object.
    }));
  };

  useEffect(() => {
    apiInstance.get(`products/`).then((response) => {
      setProducts(response.data);
    });
  }, []);

  useEffect(() => {
    apiInstance.get("category/").then((response) => {
      setCategory(response.data);
    });
  }, []);

  const handleAddToCart = async (product_id, price, shipping_amount) => {
    const formData = new FormData();
    try {
      formData.append("user_id", userData?.user_id);
      formData.append("cart_id", cartId);
      formData.append("country", currentAddress.countryName);
      formData.append("product_id", product_id);
      formData.append("price", price);
      formData.append("shipping_amount", shipping_amount);
      formData.append("size", selectedSize[product_id]);
      formData.append("color", selectedColor[product_id]);
      formData.append("item_quantity", default_quantity);

      const response = await apiInstance.post(`cart-view/`, formData);
      Toast.fire({
        icon:"success",
        title: response.data.message
      })
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <main className="mt-5">
        <div className="container">
          <section className="text-center">
            <div className="row">
              {products?.map((p, index) => (
                <div className="col-lg-4 col-md-12 mb-4" key={index}>
                  <div className="card">
                    <div
                      className="bg-image hover-zoom ripple"
                      data-mdb-ripple-color="light"
                    >
                      {/* this product-detail is to navigate another component  */}
                      <Link to={`/product-detail/${p.slug}/`}>
                        <img
                          src={p.image}
                          className="w-100"
                          style={{
                            width: "100%",
                            height: "250px",
                            objectFit: "cover",
                          }}
                        />
                      </Link>
                      <a href="#!">
                        <div className="mask">
                          <div className="d-flex justify-content-start align-items-end h-100">
                            <h5>
                              <span className="badge badge-primary ms-2">
                                New
                              </span>
                            </h5>
                          </div>
                        </div>
                        <div className="hover-overlay">
                          <div
                            className="mask"
                            style={{
                              backgroundColor: "rgba(251, 251, 251, 0.15)",
                            }}
                          />
                        </div>
                      </a>
                    </div>
                    <div className="card-body">
                      <a href="" className="text-reset">
                        <h5 className="card-title mb-3">{p.title}</h5>
                      </a>
                      <a href="" className="text-reset">
                        <p>{p.category?.title}</p>
                      </a>
                      <div className="d-flex justify-content-center">
                        <h6 className="mb-3 text-muted ms-2">
                          <strike>AED {p.old_price}</strike>
                        </h6>
                        <h6 className="mb-3 ms-2">AED {p.price}</h6>
                      </div>

                      <div className="btn-group">
                        <button
                          className="btn btn-black  dropdown-toggle"
                          type="button"
                          id="dropdownMenuClickable"
                          data-bs-toggle="dropdown"
                          data-bs-auto-close="false"
                          aria-expanded="false"
                        >
                          Variation
                        </button>
                        <ul
                          className="dropdown-menu"
                          aria-labelledby="dropdownMenuClickable"
                          style={{ backgroundColor: "white" }}
                        >
                          {p.size && p.size.length > 0 && (
                            <div className="d-flex flex-column">
                              <li className="p-1">
                                <b>Size</b>:<strong>{selectedSize[p.id]}</strong>
                              </li>
                              <div className="p-1 mt-0 pt-0 d-flex flex-wrap">
                                {p.size.map((size, index) => (
                                  <li key={index}>
                                    <button
                                      className="btn btn-black btn-sm me-2 mb-1"
                                      type="button"
                                      onClick={(e) =>
                                        handleSizeButtonClick(
                                          e,
                                          p.id,
                                          size.name
                                        )
                                      }
                                    >
                                      {size.name}
                                    </button>
                                  </li>
                                ))}
                              </div>
                            </div>
                          )}
                          {p.color && p.color.length > 0 && (
                            <div className="d-flex flex-column mt-3">
                              <li className="p-1">
                                <b>Color</b>:<strong>{selectedColor[p.id]}</strong>
                              </li>
                              <div className="p-1 mt-0 pt-0 d-flex flex-wrap">
                                {p.color.map((color, index) => (
                                  <li key={index}>
                                    <button
                                      className="btn btn-sm me-2 mb-1 color_button"
                                      onClick={(e) =>
                                        handleColorButtonClick(
                                          e,
                                          p.id,
                                          color.name
                                        )
                                      }
                                      style={{
                                        backgroundColor: color.name,
                                        borderRadius: "50%",
                                        width: "30px",
                                        height: "30px",
                                      }}
                                    />
                                  </li>
                                ))}
                              </div>
                            </div>
                          )}
                          <div className="d-flex mt-3 p-1">
                            <button
                              type="button"
                              className="btn btn-black me-1 mb-1"
                              onClick={() => handleAddToCart(p.id, p.price, p.shipping_amount)}
                            >
                              <i className="fas fa-shopping-cart" />
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger px-3 me-1 mb-1 ms-2"
                            >
                              <i className="fas fa-heart" />
                            </button>
                          </div>
                        </ul>
                        <button
                          type="button"
                          className="btn btn-danger px-3 me-1 ms-2"
                        >
                          <i className="fas fa-heart" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="row d-flex flex-wrap">
                <h4>Categories</h4>
                <br />
                <br />
                {category?.map((c, index) => (
                  <button
                    className="col-lg-2 btn p-0 d-flex flex-column align-items-center"
                    style={{ border: "none", backgroundColor: "transparent" }}
                    key={index}
                  >
                    <img
                      src={c.image}
                      alt={c.title}
                      style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                    <span
                      className="btn btn-secondary mt-2"
                      style={{
                        width: "100px",
                        backgroundColor: "white",
                        color: "black",
                        display: "block",
                        textAlign: "center",
                        border: "none",
                      }}
                    >
                      <h6>{c.title}</h6>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </section>
          {/*Section: Wishlist*/}
        </div>
      </main>
    </>
  );
}

export default Products;
