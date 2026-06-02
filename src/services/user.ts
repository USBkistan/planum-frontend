import axios from "axios";

import { privateApiClient } from "./private";

export async function getMeRequest() {
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
