import instance from "./axios";
import { AxiosRequestConfig } from "axios";

const accessToken = null;

export const httpGet = async (
  requestPath: string,
  config?: AxiosRequestConfig
): Promise<any> => {
  const axiosResponse = await instance.get(requestPath, {
    ...config,
  });
  console.log(axiosResponse);

  return axiosResponse.data;
};

export const httpPost = async (
  requestPath: string,
  data: any,
  config?: AxiosRequestConfig
): Promise<any> => {
  console.log(data);
  console.log(requestPath);
  const axiosResponse = await instance.post(requestPath, data, {
    ...config,
  });
  return axiosResponse.data;
};

export const httpPut = async (
  requestPath: string,
  data: any,
  config?: AxiosRequestConfig
): Promise<any> => {
  const axiosResponse = await instance.put(requestPath, data, {
    ...config,
  });
  return axiosResponse.data;
};

export const httpPatch = async (
  requestPath: string,
  data: any,
  config?: AxiosRequestConfig
): Promise<any> => {
  const axiosResponse = await instance.patch(requestPath, data, {
    ...config,
  });
  return axiosResponse.data;
};

export const httpDelete = async (
  requestPath: string,
  config?: AxiosRequestConfig
): Promise<any> => {
  const axiosResponse = await instance.delete(requestPath, {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
    ...config,
  });
  return axiosResponse.data;
};
