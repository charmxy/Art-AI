import axios, { AxiosRequestConfig } from "axios";
import { message } from "antd";

const instance = axios.create({
  //baseURL: "http://99.79.37.130:8000/",
  timeout: 600000,
  withCredentials: true
});

instance.interceptors.response.use(
  function (response) {
    // if (response?.data?.code === 200) return response.data.data;
    // else if (response?.data?.IpfsHash) return response.data;
    // else if (isBlob(response.data)) {
    //   let myblob = new Blob([response.data], { type: "image/*" });
    //   const url = window.URL.createObjectURL(myblob);
    //   return {
    //     url
    //   };
    // }
    // else
    //return Promise.reject("error");
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const request = (config: AxiosRequestConfig<any>) => {
  const headers = config["headers"] || {};
  if (config.isBlob) {
    headers["Content-Type"] = "multipart/form-data";
  } else {
    headers["Content-Type"] = "application/json;charset=UTF-8";
  }
  const token = localStorage.getItem("access_token");
  if (!headers["Authorization"]) headers["Authorization"] = `Basic ${token}`;
  config["headers"] = headers;
  console.log(config)

  return instance(config)
    .then(res => {
      return res;
    })
    .catch(e => {
      console.log(e?.request?.status);
      if (e?.request?.status == 401 || e?.request?.status == 403) {
        localStorage.clear();
      }
      message.error(e?.response?.data?.message);
      return Promise.reject(e);
    });
};
