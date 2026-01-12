import { createAsyncThunk } from "@reduxjs/toolkit";
import { commonReduxRequest } from "@common/api";
import { appJson, multiForm } from "@common/configurations";

// Function to Create new Customer
export const createNewCustomer = createAsyncThunk(
  "customers/createNewCustomer",
  async (formData, { rejectWithValue }) => {
    return commonReduxRequest(
      "post",
      `/admin/customer`,
      formData,
      multiForm,
      rejectWithValue
    );
  }
);

export const getCustomers = createAsyncThunk(
  "customers/getCustomers",
  async (queries, { rejectWithValue }) => {
    // normalize queries to a string without leading '?'
    let q = "";
    if (!queries) {
      q = "role=all";
    } else {
      const raw = typeof queries === "string" ? queries : String(queries);
      const cleaned = raw.startsWith("?") ? raw.slice(1) : raw;
      // if the client already included a role filter, keep it; otherwise default to role=all
      if (cleaned.includes("role=")) {
        q = cleaned;
      } else if (cleaned === "") {
        q = "role=all";
      } else {
        q = `role=all&${cleaned}`;
      }
    }

    return commonReduxRequest(
      "get",
      `/admin/customers?${q}`,
      null,
      appJson,
      rejectWithValue
    );
  }
);

export const getManagers = createAsyncThunk(
  "customers/getCustomers",
  async (queries, { rejectWithValue }) => {
    return commonReduxRequest(
      "get",
  `/admin/managers${queries ? `?${queries}` : ``}`,
      null,
      appJson,
      rejectWithValue
    );
  }
);

export const blockOrUnBlock = createAsyncThunk(
  "customers/blockOrUnBlock",
  async ({ id, isActive }, { rejectWithValue }) => {
    return commonReduxRequest(
      "patch",
      `/admin/customer-block-unblock/${id}`,
      { isActive },
      appJson,
      rejectWithValue
    );
  }
);
