import React from "react";
// this card id is only for user who is not logged in and trying to purshase. when a user is logged in we user user_id to perform this operation
function CartID() {
  const generateRandomString = () => {
    const length = 30;
    const characters = "ABCDEFGHIJKLMOPQRSTUVWUXYZ1236547890";
    let randomString = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length); // Generates a random index to pick a character from the characters string.
      randomString += characters.charAt(randomIndex);
    }
    localStorage.setItem("randomString", randomString);
    return randomString
  };

  const existingRandomString = localStorage.getItem("randomString");

  if (!existingRandomString) {
    return generateRandomString();
  } else {
    return existingRandomString
  }
}

export default CartID;
