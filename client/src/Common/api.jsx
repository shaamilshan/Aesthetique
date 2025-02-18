// import { handleError } from "./configurations";
import axios from "axios";
import { handleError } from "./configurations";

export const URL = import.meta.env.VITE_BASE_URL;
// export const URL = "http://localhost:3000/api";
// export const URL = "https://hela-ecommerce.onrender.com/api";
// export const URL = "https://hella-com-backend.up.railway.app/api";

const apiInstance = axios.create({
  baseURL: URL,
});
//bv
// Response interceptor
apiInstance.interceptors.response.use((response) => {
  // You can modify the response data here
  return response.data;
});

export const commonReduxRequest = async (
  method,
  route,
  body,
  config,
  rejectWithValue
) => {
  let requestConfig = {
    method,
    url: route,
    data: body,
    headers: config,
    withCredentials: true,
  };

  try {
    const response = await apiInstance(requestConfig);

    return response;
  } catch (error) {
    console.log(error);
    return handleError(error, rejectWithValue);
  }
};

export const commonRequest = async (method, route, body, config) => {
  let requestConfig = {
    method,
    url: route,
    data: body,
    headers: config,
    withCredentials: true,
  };

  try {
    const response = await apiInstance(requestConfig);

    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};
