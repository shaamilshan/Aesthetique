import { createAsyncThunk } from "@reduxjs/toolkit";
import { commonReduxRequest } from "@common/api";
import { appJson } from "@common/configurations";

export const getWishlist = createAsyncThunk(
  "wishlist/getWishlist",
  async (rc, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      try {
        const raw = localStorage.getItem("guest_wishlist");
        const items = raw ? JSON.parse(raw) : [];
        // Ensure shape matches server response: { wishlist: { items: [...] } }
        return { wishlist: { items } };
      } catch (e) {
        return { wishlist: { items: [] } };
      }
    }

    return commonReduxRequest(
      "get",
      `/user/wishlist`,
      null,
      appJson,
      rejectWithValue
    );
  }
);

export const deleteEntireWishlist = createAsyncThunk(
  "wishlist/deleteEntireWishlist",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      try {
        localStorage.removeItem("guest_wishlist");
        return { message: "Guest wishlist cleared" };
      } catch (e) {
        return rejectWithValue("Failed to clear guest wishlist");
      }
    }

    return commonReduxRequest(
      "delete",
      `/user/wishlist-clear`,
      {},
      appJson,
      rejectWithValue
    );
  }
);

export const deleteOneProductFromWishlist = createAsyncThunk(
  "wishlist/deleteOneProductFromWishlist",
  async (productId, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      try {
        const raw = localStorage.getItem("guest_wishlist");
        const arr = raw ? JSON.parse(raw) : [];
        const filtered = arr.filter((it) => {
          if (!it) return false;
          // item may be stored as { product: {...} }
          const pid = it.product?._id || it.product;
          return pid !== productId;
        });
        localStorage.setItem("guest_wishlist", JSON.stringify(filtered));
        return { productId };
      } catch (e) {
        return rejectWithValue("Failed to modify guest wishlist");
      }
    }

    return commonReduxRequest(
      "delete",
      `/user/wishlist-delete-item/${productId}`,
      {},
      appJson,
      rejectWithValue
    );
  }
);

export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async (formData, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    // If guest, handle locally. formData.product may be an object or an id.
    if (!token) {
      try {
        const raw = localStorage.getItem("guest_wishlist");
        const arr = raw ? JSON.parse(raw) : [];

        // Accept either full product object or id
        const incoming = formData && formData.product ? formData.product : null;
        let productObj = null;
        if (incoming && typeof incoming === "object") {
          productObj = incoming;
        } else if (typeof incoming === "string" || typeof incoming === "number") {
          // If only id provided, store as id placeholder; UI expects product object in many places,
          // so store a minimal object with _id only.
          productObj = { _id: incoming };
        }

        if (!productObj) return rejectWithValue("Invalid product data");

        // Avoid duplicates
        const exists = arr.some((it) => {
          const pid = it.product?._id || it.product;
          return pid === productObj._id;
        });

        if (!exists) {
          arr.push({ product: productObj });
          localStorage.setItem("guest_wishlist", JSON.stringify(arr));
        }

        return { wishlist: { items: arr } };
      } catch (e) {
        return rejectWithValue("Failed to add to guest wishlist");
      }
    }

    return commonReduxRequest(
      "post",
      `/user/wishlist`,
      formData,
      appJson,
      rejectWithValue
    );
  }
);
