import axios from "axios";
import z from "zod";

import { userSchema } from "@/app/schemas/user";

import { privateApiClient } from "./private";

export async function getMeRequest(): Promise<z.infer<typeof userSchema>> {
    const { data } = await axios.get(`/api/users/me`, { withCredentials: true });
    return userSchema.decode(data.data);
}

export async function updatePasswordRequest(new_password: string) {
    await privateApiClient
        .put("/users/me/password", {
            new_password: new_password,
        })
        .catch(function (error) {
            if (error.response) {
                console.log(error.response.status);
            }
        });
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
