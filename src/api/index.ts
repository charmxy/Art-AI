import { request } from "./http.ts";

export const loign = data => {
  return request({
    url: "/api/user/login",
    method: "post",
    data
  });
};

export const register = data => {
  return request({
    url: "/api/user/register",
    method: "post",
    data
  });
};

export const taskPrompt = data => {
  return request({
    url: "/api/task/prompt",
    data,
    method: "post"
  });
};

export const getTaskQueue = () => {
  return request({
    url: `/api/task/queue`,
    method: "get"
  });
};

export const getTaskStatus = () => {
  return request({
    url: `/api/task/status`,
    method: "get"
  });
};

export const getTaskVideo = params => {
  return request({
    url: `/api/task/video`,
    method: "get",
    params,
    responseType: "blob" // 确保返回的是二进制数据
  });
};

export const uploadFile = data => {
  return request({
    url: "/api/task/image",
    method: "post",
    data,
    isBlob: true,
  });
};
