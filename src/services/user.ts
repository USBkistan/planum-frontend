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
