import React from "react";
import date from "date-and-time";
import StatusComponent from "../../../components/StatusComponent";
import { AiOutlineEdit } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { URL } from "@common/api";
import { getImageUrl } from "@/Common/functions";

const OrderTableRow = ({ item, index, toggleUpdateModal, classes }) => {
  const navigate = useNavigate();
  const isRead = item.isRead === true;

  return (
    <tr
      className={`${classes} hover:bg-gray-100 transition-colors cursor-pointer ${!isRead ? "bg-blue-50/30" : "opacity-80"
        }`}
      onClick={() =>
        navigate(`/admin/order/${item.orderId || item._id}`)
      }
    >
      <td className={`admin-table-row ${!isRead ? "font-bold text-gray-900" : "text-gray-400 font-normal"}`}>
        <div className="flex items-center gap-2">
          {!isRead && <div className="w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]"></div>}
          {index}
        </div>
      </td>
      <td className="admin-table-row flex items-center gap-2">
        <div className={`w-10 h-10 overflow-clip flex justify-center items-center shrink-0 rounded bg-gray-100 ${!isRead ? "" : "opacity-70"}`}>
          {item.products[0]?.productId && item.products[0].productId.imageURL ? (
            <img
              src={getImageUrl(item.products[0].productId.imageURL, URL)}
              alt="img"
              className="object-contain w-full h-full"
            />
          ) : (
            <div className="w-10 h-10 bg-slate-200 rounded-md"></div>
          )}
        </div>
        <div>
          <p
            className={`line-clamp-1 mb-0.5 ${!isRead ? "font-bold text-gray-900 text-sm" : "font-normal text-gray-500 text-sm"
              }`}
          >
            {item.products[0]?.productId?.name || "-"}
          </p>
          <p className={`text-[11px] ${!isRead ? "font-semibold text-gray-700" : "text-gray-400"}`}>
            {item.totalQuantity === 1
              ? item.totalQuantity + " Product"
              : "+" + (item.totalQuantity - 1) + " Products"}
          </p>
        </div>
      </td>
      <td className={`admin-table-row ${!isRead ? "font-bold text-gray-900" : "text-gray-400 font-normal"}`}>
        {date.format(new Date(item.createdAt), "MMM DD YYYY")}
      </td>
      <td className={`admin-table-row ${!isRead ? "font-bold text-gray-900" : "text-gray-400 font-normal"}`}>
        {item.user ? `${item.user.firstName} ${item.user.lastName}` : (item.guestEmail || "Guest")}
      </td>
      <td className={`admin-table-row ${!isRead ? "font-bold text-gray-900" : "text-gray-400 font-normal"}`}>
        {item.totalPrice}₹
      </td>
      <td className={`admi{/* n-table-row ${!isRead ? "font-bold text-gray-900" : "text-gray-400 font-normal"}`}>
        {date.format(new Date(item.deliveryDate), "MMM DD YYYY")}
      </td>
      <td className={`admin-table-row capitalize ${!isRead ? "" : "opacity-60"}`}>
        <StatusComponent status={item.status} />
      </td>
      <td className="admin-table-row">
        <div className="flex items-center text-lg">
          <span
            className="hover:text-gray-500"
            onClick={(e) => {
              e.stopPropagation();
              toggleUpdateModal({
                id: item._id,
                status: item.status,
                paymentMode: item.paymentMode,
                deliveryDate: item.deliveryDate,
                orderDate: item.createdAt,
                trackingId: item.trackingId,
              });
            }}
          >
            <AiOutlineEdit />
          </span>
        </div>
      </td>
    </tr>
  );
};

export default OrderTableRow;
