import { createSlice } from "@reduxjs/toolkit";
import {
  getCart,
  deleteEntireCart,
  deleteOneProduct,
  decrementCount,
  incrementCount,
  applyCoupon,
  removeCoupon,
} from "../../actions/user/cartActions";
import toast from "react-hot-toast";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    loading: false,
    cart: [],
    error: null,
    cartId: "",
    totalPrice: 0,
    shipping: 0,
    tax: 0,
    discount: 0,
    couponType: "",
    couponCode: "",
    countLoading: false,
  },
  reducers: {
    calculateTotalPrice: (state) => {
      let sum = state.cart.reduce((total, item) => {
        const price = item && item.product && typeof item.product.price !== "undefined" ? Number(item.product.price) : 0;
        const qty = item && typeof item.quantity === "number" ? item.quantity : Number(item.quantity) || 0;
        return total + price * qty;
      }, 0);
      // console.log("sum");
      // console.log(sum);
      
      // state.tax = sum * 0.08;
      state.tax = 0;
      state.totalPrice = sum;
    },
    clearCartOnOrderPlaced: (state) => {
      state.loading = false;
      state.error = null;
      state.cart = [];
      state.cartId = "";
      state.totalPrice = 0;
      state.shipping = 0;
      state.tax = 0;
      state.discount = 0;
      state.couponType = "";
      state.couponCode = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCart.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.error = null;
        state.cart = payload.cart?.items || [];
        state.cartId = payload.cart?._id || "";
        state.discount = payload.cart?.discount || "";
        state.couponType = payload.cart?.type || "";
        state.couponCode = payload.cart?.couponCode || "";
      })
      .addCase(getCart.rejected, (state, { payload }) => {
        state.loading = false;
        // Keep cart as an empty array on errors to avoid UI break (components expect an array)
        state.cart = [];
        state.error = payload;
      })
      .addCase(deleteEntireCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteEntireCart.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.error = null;
        state.cart = [];
        toast.success("Cart Cleared");
      })
      .addCase(deleteEntireCart.rejected, (state, { payload }) => {
        state.loading = false;
        state.cart = [];
        state.error = payload;
      })
      .addCase(deleteOneProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteOneProduct.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.error = null;

        const { productId } = payload;

        state.cart = state.cart.filter((item) => {
          // Keep items where product exists and id doesn't match; also keep items with missing product to avoid accidental deletion here
          if (!item || !item.product || !item.product._id) return item;
          return item.product._id !== productId;
        });

        toast.success("Item Deleted");
      })
      .addCase(deleteOneProduct.rejected, (state, { payload }) => {
        state.loading = false;
        state.cart = [];
        state.error = payload;
      })

      // Updating cart on when quantity is increased

      .addCase(incrementCount.pending, (state) => {
        state.countLoading = true;
      })
      .addCase(incrementCount.fulfilled, (state, { payload }) => {
        state.countLoading = false;
        state.error = null;
        const updatedCart = state.cart.map((cartItem) => {
          if (cartItem && cartItem.product && cartItem.product._id === payload.updatedItem.product) {
            return {
              ...cartItem,
              quantity: cartItem.quantity + 1,
            };
          }
          return cartItem;
        });
        state.cart = updatedCart;
      })
      .addCase(incrementCount.rejected, (state, { payload }) => {
        state.countLoading = false;
        state.error = payload;
        toast.error(payload);
      })
      .addCase(decrementCount.pending, (state) => {
        state.countLoading = true;
      })
      .addCase(decrementCount.fulfilled, (state, { payload }) => {
        state.countLoading = false;
        state.error = null;
        const updatedCart = state.cart.map((cartItem) => {
          if (cartItem && cartItem.product && cartItem.product._id === payload.updatedItem.product) {
            return {
              ...cartItem,
              quantity: cartItem.quantity - 1,
            };
          }
          return cartItem;
        });
        state.cart = updatedCart;
      })
      .addCase(decrementCount.rejected, (state, { payload }) => {
        state.countLoading = false;
        state.error = payload;
        toast.error(payload);
      })
      // Applying coupon
      .addCase(applyCoupon.pending, (state) => {
        state.loading = true;
      })
      .addCase(applyCoupon.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.error = null;
        state.discount = payload.discount;
        state.couponType = payload.couponType;
        state.couponCode = payload.couponCode;
        toast.success("Coupon Applied");
      })
      .addCase(applyCoupon.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
        toast.error(payload);
      })
      // Removing coupon
      .addCase(removeCoupon.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeCoupon.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.error = null;
        state.discount = 0;
        state.couponType = "";
        state.couponCode = "";
        toast.success("Coupon Removed");
      })
      .addCase(removeCoupon.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export const { calculateTotalPrice, clearCartOnOrderPlaced } =
  cartSlice.actions;
export default cartSlice.reducer;
