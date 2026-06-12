import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { serverUrl } from "./globals";

export const internalApiClient = axios.create({
    baseURL: serverUrl,
    timeout: 10000,
});

internalApiClient.interceptors.request.use(async (config) => {
    const cookieStore = await cookies();
    const accessTokenCookie = cookieStore.get("access_token")!;
    if (accessTokenCookie) {
        config.headers.Authorization = `Bearer ${accessTokenCookie.value}`;
    }
    return config;
});

internalApiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const cookieStore = await cookies();
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const { data } = await axios.post(
                    `/api/auth/refresh`,
                    {},
                    { withCredentials: true },
                );

                const newAccessToken = data.access_token;
                // cookieStore.set("access_token", newAccessToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return internalApiClient(originalRequest);
            } catch (refreshError) {
                cookieStore.delete("access_token");
                cookieStore.delete("refresh_token");
                cookieStore.delete("group_id");
                redirect("/auth/login");
            }
        }

        return Promise.reject(error);
    },
);
