import { createAsyncThunk } from "@reduxjs/toolkit";
import { commonReduxRequest } from "../../../Common/api";
import { appJson } from "../../../Common/configurations";

// Get all orders
export const getOrders = createAsyncThunk(
  "orders/getOrders",
  async (queries, { rejectWithValue }) => {
    return commonReduxRequest(
      "get",
      `/admin/orders${queries ? `?${queries}` : ``}`,
      null,
      appJson,
      rejectWithValue
    );
  }
);

// Get latest orders for dashboard
export const getLatestOrders = createAsyncThunk(
  "orders/getLatestOrders",
  async (_, { rejectWithValue }) => {
    return commonReduxRequest(
      "get",
      `/admin/latest-orders`,
      null,
      appJson,
      rejectWithValue
    );
  }
);
// Get all manager orders
export const getManagerOrders = createAsyncThunk(
  "orders/getOrders",
  async ({queries,userId}, { rejectWithValue }) => {
    return commonReduxRequest(
      "get",
      `/manager/orders/a/${userId}/${queries ? `?${queries}` : ``}`,
      null,
      appJson,
      rejectWithValue
    );
  }
);

// Update the status of order
export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ id, formData }, { rejectWithValue }) => {
    return commonReduxRequest(
      "patch",
      `/admin/order-status/${id}`,
      formData,
      appJson,
      rejectWithValue
    );
  }
);

// Return Order Actions

// Get return all orders
export const getReturnOrders = createAsyncThunk(
  "orders/getReturnOrders",
  async (queries, { rejectWithValue }) => {
    return commonReduxRequest(
      "get",
      `/admin/return-orders${queries ? `?${queries}` : ``}`,
      null,
      appJson,
      rejectWithValue
    );
  }
);

export const updateReturnOrderStatus = createAsyncThunk(
  "orders/updateReturnOrderStatus",
  async ({ id, formData }, { rejectWithValue }) => {
    return commonReduxRequest(
      "patch",
      `/admin/return-order-status/${id}`,
      formData,
      appJson,
      rejectWithValue
    );
  }
);

// Get pending/non-completed orders
export const getPendingOrders = createAsyncThunk(
  "orders/getPendingOrders",
  async (queries, { rejectWithValue }) => {
    return commonReduxRequest(
      "get",
      `/admin/pending-orders${queries ? `?${queries}` : ``}`,
      null,
      appJson,
      rejectWithValue
    );
  }
);

// Delete a pending order
export const deletePendingOrder = createAsyncThunk(
  "orders/deletePendingOrder",
  async (id, { rejectWithValue }) => {
    return commonReduxRequest(
      "delete",
      `/admin/pending-order/${id}`,
      null,
      appJson,
      rejectWithValue
    );
  }
);

// Confirm a pending order
export const confirmPendingOrder = createAsyncThunk(
  "orders/confirmPendingOrder",
  async (id, { rejectWithValue }) => {
    return commonReduxRequest(
      "post",
      `/admin/confirm-pending-order/${id}`,
      null,
      appJson,
      rejectWithValue
    );
  }
);
