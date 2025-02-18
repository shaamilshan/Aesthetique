import React from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import date from "date-and-time";
import { useNavigate } from "react-router-dom";
import StatusComponent from "../../../../components/StatusComponent";
import { URL } from "@common/api";
import axios from "axios";
import { config } from "@/Common/configurations";

const TableRow = ({ index, length, product }) => {
  const navigate = useNavigate();

  const isLast = index === length - 1;
  const classes = isLast ? "p-4" : "p-4 border-b border-gray-200 ";


  const handleDelete = async (productId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this product?");
    if (isConfirmed) {
      try {
        const response = await axios.delete(`${URL}/admin/product/${productId}`, config);
        console.log("respons");
        console.log(response);

        if (response.data.product) {
          alert("Product deleted successfully!");
          // Optionally refresh the product list or navigate elsewhere
          navigate("/admin/products");
        } else {
          alert("Failed to delete the product.");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        // alert("An error occurred while deleting the product.");
        // alert(productId);
      }
    }
  };

  return (
    <tr
      className={`${classes} hover:bg-gray-200 active:bg-gray-300 cursor-pointer`}
    // onClick={() => navigate(`edit/${product._id}`)}
    >
      <td className="admin-table-row flex items-center gap-2 ">
        <div className="w-10 h-10 overflow-clip flex justify-center items-center shrink-0">
          {product.imageURL ? (
            <img
              src={`${URL}/img/${product.imageURL}`}
              alt="img"
              className="object-contain w-full h-full"
            />
          ) : (
            <div className="w-10 h-10 bg-slate-300 rounded-md"></div>
          )}
        </div>
        <p className="line-clamp-1">{product.name}</p>
      </td>
      <td className="admin-table-row">
        <div className="line-clamp-2">{product.description}</div>
      </td>
      <td className="admin-table-row">{product?.category?.name || ""}</td>
      <td className="admin-table-row">{product.stockQuantity}</td>
      <td className="admin-table-row">{product.price}</td>
      <td className="admin-table-row capitalize shrink-0">
        <StatusComponent status={product.status} />
      </td>
      <td className="admin-table-row">
        {product.createdAt
          ? date.format(new Date(product.createdAt), "MMM DD YYYY")
          : "No Data"}
      </td>
      <td className="admin-table-row">
        <div className="flex items-center gap-2 text-lg">
          <span
            className="hover:text-gray-500"
            onClick={() => navigate(`edit/${product._id}`)}
          >
            <AiOutlineEdit />
          </span>
        </div>
      </td>
      <td className="admin-table-row">
        <div className="flex items-center gap-2 text-lg">
          <span
            className="hover:text-gray-500"
            onClick={() => handleDelete(product._id)}
          >
            <AiOutlineDelete />
          </span>
        </div>
      </td>
    </tr>
  );
};

export default TableRow;

