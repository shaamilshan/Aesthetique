import React, { useState } from "react";
import { BiTrashAlt } from "react-icons/bi";
import { FaCartPlus } from "react-icons/fa";
import axios from "axios";
import { URL } from "../../../../../Common/api";
import { getImageUrl } from "../../../../../Common/functions";
import toast from "react-hot-toast";
import { config } from "../../../../../Common/configurations";
import { useNavigate } from "react-router-dom";
import { deleteOneProductFromWishlist } from "../../../../../redux/actions/user/wishlistActions";
import { useDispatch } from "react-redux";
import JustLoading from "../../../../../components/JustLoading";

const TableRow = ({ item }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cartLoading, setCartLoading] = useState(false);
  const addToCart = async (id) => {
    setCartLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        const raw = localStorage.getItem("guest_cart");
        const arr = raw ? JSON.parse(raw) : [];
        const idx = arr.findIndex((it) => (it.product?._id || it.product) === id);
        if (idx >= 0) {
          arr[idx].quantity = (arr[idx].quantity || 0) + 1;
        } else {
          arr.push({ product: { _id: id }, quantity: 1, attributes: {} });
        }
        localStorage.setItem("guest_cart", JSON.stringify(arr));
        toast.success("Added to cart");
        setCartLoading(false);
        return;
      }

      await axios.post(
        `${URL}/user/cart`,
        {
          product: id,
          quantity: 1,
          attributes: {},
        },
        config
      );
      toast.success("Added to cart");
    } catch (error) {
      const err = error.response?.data?.error || "Something went wrong";
      toast.error(err);
    } finally {
      setCartLoading(false);
    }
  };

  // Function for deleting one product from the wishlist
  const dispatchDeleteFunction = (productId) => {
    dispatch(deleteOneProductFromWishlist(productId));
  };
  return (
    <tr>
      <td
        className="px-5 py-3 flex gap-3 items-center hover:underline cursor-pointer hover:text-blue-500 w-96"
        onClick={() => navigate(`/product/${item.product._id}`)}
      >
        <div className="w-10 h-10 overflow-clip flex justify-center items-center shrink-0">
          {item.product.imageURL ? (
            <img
              src={getImageUrl(item.product.imageURL, URL)}
              alt="img"
              className="object-contain w-full h-full"
            />
          ) : (
            <div className="w-10 h-10 bg-slate-300 rounded-md"></div>
          )}
        </div>
        <p className="line-clamp-1">{item.product.name}</p>
      </td>
  <td className="px-5 py-3">₹{Number(item.product.price).toLocaleString()}</td>
      <td className="px-5 py-3 capitalize">
        {item.product.status === "published" && "available"}
        {item.product.status === "draft" && "not available"}
        {item.product.status === "unpublished" && "not available"}
        {item.product.status === "low quantity" && "low quantity"}
        {item.product.status === "out of stock" && "out of stock"}
      </td>
      <td className="px-5 py-3 text-xl">
        <div className="flex items-center gap-3">
          {cartLoading ? (
            <JustLoading size={5} />
          ) : (
            <FaCartPlus
              className="hover:text-gray-700 cursor-pointer"
              onClick={() => {
                addToCart(item.product._id);
              }}
            />
          )}
          <BiTrashAlt
            className="hover:text-gray-700 cursor-pointer"
            onClick={() => {
              dispatchDeleteFunction(item.product._id);
            }}
          />
        </div>
      </td>
    </tr>
  );
};

export default TableRow;
