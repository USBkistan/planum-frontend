import axios from "axios";
import z from "zod";

import { userSchema } from "@/app/schemas/user";

import { privateApiClient } from "./private";

export async function getMeRequest(): Promise<z.infer<typeof userSchema> | undefined> {
    const response = await privateApiClient.get("/users/me").catch(function (error) {
        if (error.response) {
            console.log(error.response.status);
        }
    });

    if (response) {
        return userSchema.decode(response.data);
    }
}

export async function getMeWrapper() {
    await axios.get(`/api/users/me`, { withCredentials: true });
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
