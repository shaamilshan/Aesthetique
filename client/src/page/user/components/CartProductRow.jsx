import React from "react";
import { URL } from "../../../Common/api";
import {
  incrementCount,
  decrementCount,
} from "../../../redux/actions/user/cartActions";
import Quantity from "../components/Quantity";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineDelete } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import JustLoading from "../../../components/JustLoading";

const CartProductRow = ({ item, isLast, toggleProductConfirm }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartId, countLoading } = useSelector((state) => state.cart);

  const dispatchIncrement = (item) => {
    dispatch(
      incrementCount({
        cartId,
        productId: item.product._id,
        attributes: item.attributes,
        productdata: item.product,
        quantity: item.quantity,
      })
    );
  };

  const dispatchDecrement = (item) => {
    dispatch(decrementCount({ cartId, productId: item.product._id }));
  };

  return (
    <tr className={isLast ? "" : "border-b"}>
      <td
        className="cart-table-row hover:underline cursor-pointer hover:text-blue-500"
        onClick={() => navigate(`/product/${item.product._id}`)}
      >
        <div className="flex items-center gap-3 w-full">
          {item.product.imageURL ? (
            <div className="w-10 h-10 shrink-0">
              <img
                src={`${URL}/img/${item.product.imageURL}`}
                alt="Product"
                className="h-full w-full object-contain"
              />
            </div>
          ) : (
            <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
          )}
          <div>
            <p className="line-clamp-1">{item.product.name}</p>
            {/* Displaying attributes */}
            {item.attributes && (
              <div className="text-sm text-gray-500">
                {Object.entries(item.attributes).map(([key, value]) => (
                  <p key={key}>
                    <span className="font-medium">{key}:</span> {value}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </td>
      <td className="cart-table-row">
        {item.product.price + item.product.markup}
      </td>
      <td className="cart-table-row w-36">
        {countLoading ? (
          <JustLoading size={10} />
        ) : (
          <Quantity
            count={item.quantity}
            increment={() => dispatchIncrement(item)}
            decrement={() => dispatchDecrement(item)}
          />
        )}
      </td>
      <td className="cart-table-row">
        {(item.product.price + item.product.markup) * item.quantity}
      </td>
      <td>
        <div
          onClick={() => toggleProductConfirm(item.product._id)}
          className="cursor-pointer"
        >
          <AiOutlineDelete className="text-xl" />
        </div>
      </td>
    </tr>
  );
};

export default CartProductRow;
