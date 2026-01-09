import { createAsyncThunk } from "@reduxjs/toolkit";
import { commonReduxRequest } from "@common/api";
import { appJson } from "@common/configurations";

// Fetching whole cart
export const getCart = createAsyncThunk(
  "cart/getCart",
  async (rc, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      try {
        const raw = localStorage.getItem("guest_cart");
        const items = raw ? JSON.parse(raw) : [];
        return { cart: { items, _id: "", discount: 0, type: "", couponCode: "" } };
      } catch (e) {
        return { cart: { items: [] } };
      }
    }

    return commonReduxRequest(
      "get",
      `/user/cart`,
      {},
      appJson,
      rejectWithValue
    );
  }
);

// Deleting whole cart
export const deleteEntireCart = createAsyncThunk(
  "cart/deleteEntireCart",
  async (id, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      try {
        localStorage.removeItem("guest_cart");
        return { message: "Guest cart cleared" };
      } catch (e) {
        return rejectWithValue("Failed to clear guest cart");
      }
    }

    return commonReduxRequest(
      "delete",
      `/user/cart/${id}`,
      {},
      appJson,
      rejectWithValue
    );
  }
);

// Deleting one item from the cart
export const deleteOneProduct = createAsyncThunk(
  "cart/deleteOneProduct",
  async ({ cartId, productId }, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      try {
        const raw = localStorage.getItem("guest_cart");
        const arr = raw ? JSON.parse(raw) : [];
        const filtered = arr.filter((it) => {
          const pid = it.product?._id || it.product;
          return pid !== productId;
        });
        localStorage.setItem("guest_cart", JSON.stringify(filtered));
        return { productId };
      } catch (e) {
        return rejectWithValue("Failed to modify guest cart");
      }
    }

    return commonReduxRequest(
      "delete",
      `/user/cart/${cartId}/item/${productId}`,
      {},
      appJson,
      rejectWithValue
    );
  }
);

// Incrementing the count of one product
export const incrementCount = createAsyncThunk(
  "cart/incrementCount",
  async (
    { cartId, productId, attributes, productdata, quantity },
    { rejectWithValue }
  ) => {
    const token = localStorage.getItem("token");
    if (!token) {
      try {
        const raw = localStorage.getItem("guest_cart");
        const arr = raw ? JSON.parse(raw) : [];
        const idx = arr.findIndex((it) => (it.product?._id || it.product) === productId);
        if (idx >= 0) {
          arr[idx].quantity = (arr[idx].quantity || 0) + 1;
          localStorage.setItem("guest_cart", JSON.stringify(arr));
          return { updatedItem: { product: productId } };
        }
        return rejectWithValue("Product not found in guest cart");
      } catch (e) {
        return rejectWithValue("Failed to update guest cart");
      }
    }

    return commonReduxRequest(
      "patch",
      `/user/cart-increment-quantity/${cartId}/item/${productId}`,
      {
        attributes,
        productdata,
        quantity,
      },
      appJson,
      rejectWithValue
    );
  }
);

// Decrementing the count of one product
export const decrementCount = createAsyncThunk(
  "cart/decrementCount",
  async ({ cartId, productId }, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      try {
        const raw = localStorage.getItem("guest_cart");
        const arr = raw ? JSON.parse(raw) : [];
        const idx = arr.findIndex((it) => (it.product?._id || it.product) === productId);
        if (idx >= 0) {
          arr[idx].quantity = Math.max(0, (arr[idx].quantity || 0) - 1);
          // remove if quantity becomes zero
          const filtered = arr.filter((it) => (it.quantity || 0) > 0);
          localStorage.setItem("guest_cart", JSON.stringify(filtered));
          return { updatedItem: { product: productId } };
        }
        return rejectWithValue("Product not found in guest cart");
      } catch (e) {
        return rejectWithValue("Failed to update guest cart");
      }
    }

    return commonReduxRequest(
      "patch",
      `/user/cart-decrement-quantity/${cartId}/item/${productId}`,
      {},
      appJson,
      rejectWithValue
    );
  }
);

// Applying coupon to cart
export const applyCoupon = createAsyncThunk(
  "cart/applyCoupon",
  async (couponCode, { rejectWithValue }) => {
    return commonReduxRequest(
      "post",
      `/user/coupon-apply`,
      { code: couponCode },
      appJson,
      rejectWithValue
    );
  }
);

// Removing existing coupon of a cart

export const removeCoupon = createAsyncThunk(
  "cart/removeCoupon",
  async (_, { rejectWithValue }) => {
    return commonReduxRequest(
      "get",
      `/user/coupon-remove`,
      {},
      appJson,
      rejectWithValue
    );
  }
);
