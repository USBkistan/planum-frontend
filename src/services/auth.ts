import axios from "axios"
import { loginSchema, registerSchema } from "@/app/schemas/auth";
import z from "zod";

const serverUrl = "http://127.0.0.1:8000/v1";

const apiClient = axios.create({
    baseURL: serverUrl,
    timeout: 1000,
});

interface AuthResponse {
    access_token: string,
    refresh_token: string,
}

export async function loginRequest(data: z.infer<typeof loginSchema>): Promise<AuthResponse | undefined> {
    const payload = {
        username: data.email,
        password: data.password,
    }

    const response = await apiClient.post(
        "/auth/login",
        payload,
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
    ).catch(function (error) {
        if (error.response) {
            console.log(error.response.status);
        }
    });

    if (response) {
        return {
            access_token: response.data["access_token"],
            refresh_token: response.data["refresh_token"],
        };
    }
}

export async function registerRequest(data: z.infer<typeof registerSchema>): Promise<AuthResponse | undefined> {
    const payload = {
        display_name: data.username,
        email: data.email,
        password: data.password,
    }

    const response = await apiClient.post(
        "/auth/register",
        payload,
        { headers: { "Content-Type": "application/json" } },
    ).catch(function (error) {
        if (error.response) {
            console.log(error.response.status);
        }
    });

    if (response) {
        return {
            access_token: response.data["access_token"],
            refresh_token: response.data["refresh_token"],
        };
    }
}
