import axios from "axios";
// import EventEmitter from "./emitter";

const baseURL = "http://localhost:8000";

const instance = axios.create({
  baseURL,
  timeout: 100000,
});

// instance.interceptors.request.use(
//   (config) => {
//     // adding Authorization to all requests
//     config.headers = {
//       ...config.headers,
//     };
//     return config;
//   },
//   (error) => {
//     console.log(error);
//     // Do something with request error
//     return Promise.reject(error.response.data);
//   }
// );

export default instance;
