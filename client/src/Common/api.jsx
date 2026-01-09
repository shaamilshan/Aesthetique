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

  if (body instanceof FormData && requestConfig.headers) {
    if (Object.prototype.hasOwnProperty.call(requestConfig.headers, "Content-Type")) {
      delete requestConfig.headers["Content-Type"];
    }
  }

  // If body is FormData, let the browser set the Content-Type (including boundary).
  // Some callers pass a headers object like { 'Content-Type': 'multipart/form-data' }
  // which prevents the browser from attaching the multipart boundary. Remove it here.
  if (body instanceof FormData && requestConfig.headers) {
    // Accept either plain headers object or the `headers` wrapper shape
    if (Object.prototype.hasOwnProperty.call(requestConfig.headers, "Content-Type")) {
      delete requestConfig.headers["Content-Type"];
    }
  }

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
