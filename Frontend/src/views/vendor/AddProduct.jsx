import React, { useEffect, useState } from "react";
import VendorSideBar from "./VendorSideBar";
import apiInstance from "../../utils/axios";
import UserData from "../plugin/UserData";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";



function AddProduct() {
    const userData = UserData()
    const navigate = useNavigate()
    const [product, setProduct] = useState({
        title: "",
        image: null,
        description: "",
        category: "",
        price: "",
        old_price: "",
        shipping_amount: "",
        stock_quantity: "",
        in_stock: "",
        title: "",
        vendor: userData?.vendor_id
    })

    const [specifications, setSpecifications] = useState([{ title: "", content: "" }]);
    const [colors, setColors] = useState([{ color_name: "", color_code: "" }]);
    const [sizes, setSizes] = useState([{ size_name: "", price: "" }]);  // Fix "prize" to "price"
    const [gallery, setGallery] = useState([{ image: null }]);
    const [category, setCategory] = useState([]);  


    const handleAddMore = (setStateFunction) => {
        setStateFunction((prevstate) => [...prevstate, {}])
    }

    const handleRemove = (index, setStateFunction) => {
        setStateFunction((prevstate) => {
            const newState = [...prevstate]
            newState.splice(index, 1)
            return newState
        })
    }

    const handleInputChange = (index, key, value, setStateFunction) => {
      setStateFunction((prevState) => {
        const newState = [...prevState];
        
        if (!newState[index]) {
          newState[index] = {};  // Ensure the index exists
        }
        
        newState[index][key] = value;  // Update the key
        
        console.log("Updated State:", newState);  // Debugging Log
        return newState;
      });
    };
    console.log("Final sizes Data before submission:", sizes);

    

    const handleImageChange = (index, event, setStateFunction) => {
      const file = event.target.files[0];
  
      if (file) {
          const reader = new FileReader();
  
          reader.onloadend = () => {
              setStateFunction((prevState) => {
                  const newState = [...prevState];
                  if (!newState[index]) {
                      newState[index] = { image: null };
                  }
                  
                  newState[index].image = { file, preview: reader.result }; // Store file + preview
                  return newState;
              });
          };
  
          reader.readAsDataURL(file); // Generate preview
      } else {
          setStateFunction((prevState) => {
              const newState = [...prevState];
  
              if (!newState[index]) {
                  newState[index] = { image: null };
              }
  
              newState[index].image = null;
              return newState;
          });
      }
  };
  

    const handleProductInputChange = (event) => {
        setProduct({
            ...product,
            [event.target.name]: event.target.value
        })
        console.log(product)
    }

    const handleProductFileChange = (event) => {
        const file = event.target.files[0]
        if (file){
            const reader = new FileReader()

            reader.onloadend = () => {
                setProduct({
                    ...product,
                    image: {
                        file: event.target.files[0],
                        preview: reader.result
                    }
                })
            }
            reader.readAsDataURL(file)
        }
    }

    useEffect(() => {
        apiInstance.get('category/').then((res) => {
            setCategory(res.data)
            console.log(category)
        })
    },[])

   
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Append product fields
    Object.entries(product).forEach(([key, value]) => {
      if (key === "image" && value) {
        formData.append(key, value.file || value);
      } else if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    // Append specifications
    specifications.forEach((spec, index) => {
      Object.entries(spec).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(`specifications[${index}][${key}]`, value);
        }
      });
    });

    // Append colors
    colors.forEach((color, index) => {
      Object.entries(color).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(`colors[${index}][${key}]`, value);
        }
      });
    });

    // Append sizes
    sizes.forEach((size, index) => {
      Object.entries(size).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(`sizes[${index}][${key}]`, value);
        }
      });
    });

    // Append gallery images
    gallery.forEach((item, index) => {
      if (item.image) {
        formData.append(`gallery[${index}][image]`, item.image.file || item.image);
      }
    });

    // Debugging: Log FormData
    console.log("Submitting FormData:");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      const response = await apiInstance.post("vendor-create-product/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Success:", response.data);

      // Show success message
      Swal.fire({
        title: "Product Created!",
        text: "Your product has been successfully added.",
        icon: "success",
        confirmButtonText: "OK",
      });

      navigate('/vendor/products')

    } catch (error) {
      console.error("Error Response:", error.response?.data || error.message);

      // Show error message
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to create product. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

    

  return (
    <>
    <div className="container-fluid" id="main">
  <div className="row row-offcanvas row-offcanvas-left h-100">
    <VendorSideBar/>

    <div className="col-md-9 col-lg-10 main mt-4">
      <div className="container">
        <form onSubmit={handleSubmit} className="main-body">
          <div className="tab-content" id="pills-tabContent">
            <div
              className="tab-pane fade show active"
              id="pills-home"
              role="tabpanel"
              aria-labelledby="pills-home-tab"
            >
              <div className="row gutters-sm shadow p-4 rounded">
                <h4 className="mb-4">Product Details</h4>
                <div className="col-md-12">
                  <div className="card mb-3">
                    <div className="card-body">
                        {/*  */}
                        <div className="row text-dark">
                          <div className="col-lg-6 mb-2">
                            <label htmlFor="" className="mb-2">
                              Product Thumbnail
                            </label>
                            <input
                              type="file"
                              className="form-control"
                              name="image"
                              id=""
                              onChange={handleProductFileChange}
                            />
                          </div>
                          <div className="col-lg-6 mb-2 ">
                            <label htmlFor="" className="mb-2">
                              Title
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="title"
                              id=""
                              value = {product.title || ""}
                              onChange={handleProductInputChange}
                            />
                          </div>
                          <div className="col-lg-12 mb-2">
                            <label htmlFor="" className="mb-2">
                              Description
                            </label>
                            <textarea
                              className="form-control"     
                              cols={30}
                              rows={10}
                              defaultValue={""}
                              name="description"
                              id=""
                              value = {product.description || ""}
                              onChange={handleProductInputChange}
                            />
                          </div>
                          <div className="col-lg-6 mb-2">
                            <label htmlFor="" className="mb-2">
                              Category
                            </label>
                            <select                             
                              className="select form-control"
                              id=""
                              name="category"
                              value={product.category || ""}
                              onChange={handleProductInputChange}
                            >
                              <option value="">- Select -</option>
                            {category?.map((c, index) => (
                                 <option key={index} value={c.id}>{c.title}</option>
                            ))}
                            </select>
                          </div>                        
                          <div className="col-lg-6 mb-2 ">
                            <label htmlFor="" className="mb-2">
                              Sale Price
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="price"
                              id=""
                              onChange={handleProductInputChange}
                              value={product.price |  ""}
                            />
                          </div>
                          <div className="col-lg-6 mb-2 ">
                            <label htmlFor="" className="mb-2">
                              old Price
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="old_price"
                              id=""
                              onChange={handleProductInputChange}
                              value={product.old_price |  ""}
                            />
                          </div>
                          <div className="col-lg-6 mb-2 ">
                            <label htmlFor="" className="mb-2">
                              Shipping Amount
                            </label>
                            <input
                               type="text"
                               className="form-control"
                               name="shipping_amount"
                               id=""
                               onChange={handleProductInputChange}
                               value={product.shipping_amount |  ""}
                            />
                          </div>
                          <div className="col-lg-6 mb-2 ">
                            <label htmlFor="" className="mb-2">
                              Stock Qty
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="stock_quantity"
                              id=""
                              onChange={handleProductInputChange}
                              value={product.stock_quantity |  ""}
                            />
                          </div>
                        </div>
                     
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="pills-profile"
              role="tabpanel"
              aria-labelledby="pills-profile-tab"
            >
              <div className="row gutters-sm shadow p-4 rounded">
                <h4 className="mb-4">Product Image</h4>
                <div className="col-md-12">
                  <div className="card mb-3">
                    {/* galleryyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy */}
                    <div className="card-body">
                        {gallery?.map((item, index) => (
                        <div className="row text-dark">
                      <div className="col-lg-12 mb-2 d-flex align-items-center">
                        {item.image && (
                            <img
                            style={{ width: "300px", height: "300px", objectFit: "cover", marginRight: "10px" }}
                            src={item.image?.preview}
                            alt=""
                        />
                        )}
                        {!item.image && (
                            <img
                            style={{ width: "100px", height: "100px", objectFit: "cover", marginRight: "10px" }}
                            src="https://imchospital.com.pk/storage/assets/images/medicines/placeholder.jpg"
                            alt=""
                        />
                        )}

                        
                        <input
                            type="file"
                            className="form-control"
                            name="image"
                            id=""
                            onChange={(e) => handleImageChange(index, e, setGallery)}
                        />
                        </div>
                        <div className="col-lg-3 mt-4">
                            <button onClick={() => handleRemove(index, setGallery)}className="btn btn-danger">Remove</button>
                        </div>
    
                        </div>

                       ))}

                      <button onClick={() => handleAddMore(setGallery)} type='button'  className="btn btn-primary mt-5">
                        <i className="fas fa-plus" /> Add Image
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="pills-contact"
              role="tabpanel"
              aria-labelledby="pills-contact-tab"
            >
              <div className="row gutters-sm shadow p-4 rounded">
                <h4 className="mb-4">Specifications</h4>
                <div className="col-md-12">
                  <div className="card mb-3">
                    {/* speciiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii */}
                    <div className="card-body">
                        {specifications?.map ((s, index) => (
                      <div className="row text-dark">
                        <div className="col-lg-6 mb-12">
                          <label htmlFor="" className="mb-2">
                            Title
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                            onChange={(e) => handleInputChange(index, 'title', e.target.value, setSpecifications)}
                          />
                        </div>
                        <div className="col-lg-6 mb-2">
                          <label htmlFor="" className="mb-2">
                            Content
                          </label>
                          <input
                            type="text"
                            className="form-control"  
                            name=""
                            id=""
                            onChange={(e) => handleInputChange(index, 'content', e.target.value, setSpecifications)}
                          />
                        </div>
                        <div className="col-lg-6 mb-1">
                          <button onClick={() => handleRemove(index, setSpecifications)} className="btn btn-danger">Remove</button>
                        </div>
                      </div>
                    ))}
                      <button onClick={() => handleAddMore(setSpecifications)} type='button' className="btn btn-primary mt-5">
                        <i className="fas fa-plus" /> Add Specifications
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="pills-contact"
              role="tabpanel"
              aria-labelledby="pills-contact-tab"
            >
              {/* here */}
            </div>
            <div
              className="tab-pane fade"
              id="pills-size"
              role="tabpanel"
              aria-labelledby="pills-size-tab"
            >
              <div className="row gutters-sm shadow p-4 rounded">
                <h4 className="mb-4">Size</h4>
                <div className="col-md-12">
                  <div className="card mb-3">
                    {/* sizeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee */}
                    <div className="card-body">
                        {sizes?.map((size, index) => (
                      <div className="row text-dark">
                        <div className="col-lg-6 mb-2">
                          <label htmlFor="" className="mb-2">
                            Size
                          </label>
                        <input
                          type="text"
                          className="form-control"
                          value={sizes[index]?.size_name || ""}
                          onChange={(e) => handleInputChange(index, 'size_name', e.target.value, setSizes)} 
                        />
                        </div>
                        <div className="col-lg-6 mb-2">
                          <label htmlFor="" className="mb-2">
                            Price
                          </label>
                        <input
                          type="number"
                          className="form-control"
                          value={sizes[index]?.price || "600"}
                          onChange={(e) => handleInputChange(index, 'price', e.target.value, setSizes)}
                        />
                        </div>
                        <div className="col-lg-6 mb-1">
                          <button onClick={() => handleRemove(index, setSizes)} className="btn btn-danger">Remove</button>
                        </div>
                      </div>
                        ))}
                     <button onClick={() => handleAddMore(setSizes)} type='button'  className="btn btn-primary mt-5">
                        <i className="fas fa-plus" /> Add Size
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="pills-color"
              role="tabpanel"
              aria-labelledby="pills-color-tab"
            >
              <div className="row gutters-sm shadow p-4 rounded">
                <h4 className="mb-4">Color</h4>
                <div className="col-md-12">
                  <div className="card mb-3">
                    {/* coloreeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee */}
                    <div className="card-body">
                        {colors?.map((color, index) => (
                      <div className="row text-dark">
                        <div className="col-lg-4 mb-2">
                          <label htmlFor="" className="mb-2">
                            Name
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name=""
                            placeholder="Green"
                            id=""
                            onChange={(e) => handleInputChange(index, 'color_name', e.target.value, setColors)}
                            value={colors[index]?.color_name || ""}
                          />
                        </div>
                        <div className="col-lg-4 mb-2">
                          <label htmlFor="" className="mb-2">
                            Code
                          </label>
                          <input
                            type="text"
                            placeholder="#f4f7f6"
                            className="form-control"
                            name=""
                            id=""
                            value={colors[index]?.color_code || ""}
                            onChange={(e) => handleInputChange(index, 'color_code', e.target.value, setColors)}
                            
                          />
                        </div>
                        <div className="col-lg-4 mb-2">
                          <label htmlFor="" className="mb-2">
                            Image
                          </label>
                          <input
                            type="file"
                            className="form-control"
                            name=""
                            id=""
                          //  here file
                          />
                        </div>
                        <div className="col-lg-6 mb-1">
                          <button onClick={() => handleRemove(index, setColors)} className="btn btn-danger">Remove</button>
                        </div>
                      </div>
                      ))}
                     <button onClick={() => handleAddMore(setColors)} type='button' className="btn btn-primary mt-5">
                        <i className="fas fa-plus" /> Add Color
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <ul
                className="nav nav-pills mb-3 d-flex justify-content-center mt-5"
                id="pills-tab"
                role="tablist"
              >
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link active"
                    id="pills-home-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-home"
                    type="button"
                    role="tab"
                    aria-controls="pills-home"
                    aria-selected="true"
                  >
                    Basic Information
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="pills-profile-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-profile"
                    type="button"
                    role="tab"
                    aria-controls="pills-profile"
                    aria-selected="false"
                  >
                    Gallery
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="pills-contact-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-contact"
                    type="button"
                    role="tab"
                    aria-controls="pills-contact"
                    aria-selected="false"
                  >
                    Specifications
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="pills-size-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-size"
                    type="button"
                    role="tab"
                    aria-controls="pills-size"
                    aria-selected="false"
                  >
                    Size
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="pills-color-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-color"
                    type="button"
                    role="tab"
                    aria-controls="pills-color"
                    aria-selected="false"
                  >
                    Color
                  </button>
                </li>
              </ul>
              <div className="d-flex justify-content-center mb-5">
                <button className="btn btn-success w-50" type="submit">
                  Create Product <i className="fa fa-check-circle" />{" "}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>

    </>
  )
}

export default AddProduct