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
    appliedCoupons: [],
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
    setShipping: (state, action) => {
      state.shipping = action.payload;
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
      state.appliedCoupons = [];
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
        state.discount = payload.cart?.discount || 0;
        state.appliedCoupons = payload.cart?.appliedCoupons || [];
        state.couponType = "";
        state.couponCode = "";
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
        state.discount = 0;
        state.couponType = "";
        state.couponCode = "";
        toast.success("Cart Cleared");
      })
      .addCase(deleteEntireCart.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(deleteOneProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteOneProduct.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.error = null;
        // Server returns full cart; guest returns { productId }
        if (payload.cart) {
          state.cart = payload.cart.items || [];
          state.cartId = payload.cart._id || "";
          state.discount = payload.cart.discount || 0;
          state.appliedCoupons = payload.cart.appliedCoupons || [];
          state.couponType = "";
          state.couponCode = "";
        } else if (payload.productId) {
          // Guest flow: remove the item locally from the existing cart state
          state.cart = state.cart.filter((item) => {
            const pid = item.product?._id || item.product;
            return pid !== payload.productId;
          });
        }
        toast.success("Item Deleted");
      })
      .addCase(deleteOneProduct.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Updating cart on when quantity is increased

      .addCase(incrementCount.pending, (state) => {
        state.countLoading = true;
      })
      .addCase(incrementCount.fulfilled, (state, { payload }) => {
        state.countLoading = false;
        state.error = null;
        // Server returns full cart; guest returns { updatedItem }
        if (payload.cart) {
          state.cart = payload.cart.items || [];
          state.cartId = payload.cart._id || "";
          state.discount = payload.cart.discount || 0;
          state.appliedCoupons = payload.cart.appliedCoupons || [];
          state.couponType = "";
          state.couponCode = "";
        } else if (payload.updatedItem) {
          // Guest flow: update quantity locally
          const pid = payload.updatedItem.product;
          state.cart = state.cart.map((item) => {
            const itemPid = item.product?._id || item.product;
            if (itemPid === pid) {
              return { ...item, quantity: (item.quantity || 0) + 1 };
            }
            return item;
          });
        }
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
        // Server returns full cart; guest returns { updatedItem }
        if (payload.cart) {
          state.cart = payload.cart.items || [];
          state.cartId = payload.cart._id || "";
          state.discount = payload.cart.discount || 0;
          state.appliedCoupons = payload.cart.appliedCoupons || [];
          state.couponType = "";
          state.couponCode = "";
        } else if (payload.updatedItem) {
          // Guest flow: update quantity locally, remove if quantity reaches 0
          const pid = payload.updatedItem.product;
          state.cart = state.cart
            .map((item) => {
              const itemPid = item.product?._id || item.product;
              if (itemPid === pid) {
                return { ...item, quantity: Math.max(0, (item.quantity || 0) - 1) };
              }
              return item;
            })
            .filter((item) => (item.quantity || 0) > 0);
        }
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
        state.discount = payload.discount || 0;
        state.appliedCoupons = payload.appliedCoupons || [];
        state.couponType = "";
        state.couponCode = "";
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
        state.discount = payload.discount || 0;
        state.appliedCoupons = payload.appliedCoupons || [];
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

export const { calculateTotalPrice, setShipping, clearCartOnOrderPlaced } =
  cartSlice.actions;
export default cartSlice.reducer;
