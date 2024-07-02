import instance from "./axios";
import { AxiosRequestConfig } from "axios";

const accessToken = null;

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

// export const httpPost = async (
//   requestPath: string,
//   data: any,
//   config?: AxiosRequestConfig
// ): Promise<any> => {
//   console.log("POST request data:", data); // Logging request data
//   console.log("POST request path:", requestPath); // Logging request path

//   try {
//     const axiosResponse = await instance.post(requestPath, data, {
//       ...config,
//       headers: {
//         ...config?.headers,
//         'Authorization': `Bearer ${accessToken}`, // Example of passing an access token
//       },
//     });

//     console.log("POST response:", axiosResponse.data); // Logging response data

//     return axiosResponse.data; // Returning response data
//   } catch (error) {
//     console.error("POST request error:", error); // Logging any errors that occur
//     throw error; // Rethrow the error to handle it in the calling function
//   }
// };

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
