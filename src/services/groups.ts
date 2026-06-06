import axios from "axios";

import { GroupCreateData, GroupInviteData } from "@/app/schemas/groups";
import { UserData, userSchema } from "@/app/schemas/user";

import { privateApiClient } from "./private";

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

export async function getInviteCodeRequest(): Promise<string> {
    const { data } = await privateApiClient.get("/groups/invite");
    return data["code"];
}

export async function leaveGroupRequest() {
    await privateApiClient.post("/groups/leave");
}

export async function getGroupMembersRequest(): Promise<UserData[]> {
    const { data } = await privateApiClient.get("/groups/users");
    return data.map((e: any) => userSchema.decode(e));
}
