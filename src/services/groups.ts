import axios from "axios";

import { GroupCreateData, GroupInviteData } from "@/app/schemas/groups";

export async function createGroupRequest(data: GroupCreateData) {
    await axios
        .post("/api/groups", { ...data }, { withCredentials: true })
        .catch(function (error) {
            if (error.response) {
                console.log(error.response.status);
            }
        });
}

export async function inviteToGroupRequest(data: GroupInviteData) {
    await axios
        .post("/api/groups/invite", { ...data }, { withCredentials: true })
        .catch(function (error) {
            if (error.response) {
                console.log(error.response.status);
            }
        });
}
