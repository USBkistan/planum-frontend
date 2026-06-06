import axios from "axios";
import Cookies from "js-cookie";
import { redirect } from "next/navigation";

import { serverUrl } from "./globals";

export const privateApiClient = axios.create({
    baseURL: serverUrl,
    timeout: 10000,
});

privateApiClient.interceptors.request.use((config) => {
    const token = Cookies.get("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

privateApiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const { data } = await axios.post(
                    `/api/auth/refresh`,
                    {},
                    { withCredentials: true },
                );
                console.log(data);

                const newAccessToken = data.access_token;
                Cookies.set("access_token", newAccessToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return privateApiClient(originalRequest);
            } catch (refreshError) {
                Cookies.remove("access_token");
                redirect("/auth/login");
            }
        }

        return Promise.reject(error);
    },
);
