import axios, { AxiosError } from "axios";

import { UserData, userSchema } from "@/app/schemas/user";

import { privateApiClient } from "./private";

export async function getMeRequest(): Promise<UserData> {
    const { data } = await axios.get(`/api/users/me`, { withCredentials: true });
    return userSchema.decode(data.data);
}

export async function updatePasswordRequest(
    current_password: string,
    new_password: string,
): Promise<string | null> {
    try {
        await privateApiClient.put("/users/me/password", {
            current_password: current_password,
            new_password: new_password,
        });
        return null;
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.status === 400) {
                return "Текущий пароль не верный";
            }
        }
    }

    return null;
}

export async function updateNameRequest(name: string) {
    await privateApiClient
        .patch("/users/me", {
            display_name: name,
        })
        .catch(function (error) {
            if (error.response) {
                console.log(error.response.status);
            }
        });
}
