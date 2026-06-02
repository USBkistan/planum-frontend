import axios from "axios";
import z from "zod";

import { GroupCreateData, groupSchema } from "@/app/schemas/groups";

export async function createGroupRequest(data: GroupCreateData) {
    await axios
        .post("/api/groups", { ...data }, { withCredentials: true })
        .catch(function (error) {
            if (error.response) {
                console.log(error.response.status);
            }
        });
}
