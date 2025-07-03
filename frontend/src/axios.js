import axios from "axios";
import { API_BASE_URL } from "./constants";
import { useEffect, useState } from "react";



const instance = axios.create({
    baseURL: API_BASE_URL+"api",
    // baseURL: "http://192.168.100.18:8000/api",
    
    // baseURL: "http://172.20.41.64:8000/api",
    
    // headers: {
    //     // Accept: "application/json",
    //     'Content-Type': 'application/json',
    // },
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
    res => res,
    err => {
        if (err.response && err.response.status === 401) {
            // window.location.href = "/admin/login";
        }
        return Promise.reject(err);
    }
);

export default instance;
