import React from "react";
import { AiOutlineEdit } from "react-icons/ai";
import date from "date-and-time";
import StatusComponent from "../../../../components/StatusComponent";

const TableRow = ({ isLast, customer, toggleBlockUnBlockModal }) => {
  const name = `${customer.firstName || ''} ${customer.lastName || ''}`.trim();
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <tr className={`hover:bg-gray-50`}>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-700">{initials || 'U'}</div>
          <div>
            <div className="text-sm font-medium text-gray-900">{name || 'Unknown'}</div>
            <div className="text-xs text-gray-500">{customer.email}</div>
          </div>
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="text-sm text-gray-700">{customer.phoneNumber || '-'}</div>
      </td>

      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${customer.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : customer.role === 'superAdmin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
          {customer.role ? (customer.role === 'superAdmin' ? 'SuperAdmin' : customer.role.charAt(0).toUpperCase() + customer.role.slice(1)) : 'User'}
        </span>
      </td>

      <td className="px-6 py-4">
        <StatusComponent status={customer.isActive ? 'Active' : 'Blocked'} />
      </td>

      <td className="px-6 py-4 text-sm text-gray-500">
        {customer.createdAt ? date.format(new Date(customer.createdAt), 'MMM DD YYYY') : 'No Data'}
      </td>

      <td className="px-6 py-4 text-right">
        {/* Do not show role-editing / actions for plain users */}
        {customer.role && customer.role !== "user" ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleBlockUnBlockModal({ id: customer._id, status: customer.isActive, role: customer.role });
            }}
            className="inline-flex items-center justify-center h-8 w-8 rounded-md bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            aria-label="Edit user"
          >
            <AiOutlineEdit />
          </button>
        ) : (
          <span className="text-xs text-gray-400">-</span>
        )}
      </td>
    </tr>
  );
};

export default TableRow;
