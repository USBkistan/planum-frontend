interface LoginRequestData {
    username: string,
    password: string,
};

interface RegisterRequestData {
    email: string,
    password: string,
    display_name: string,
};

export async function loginRequest(data: LoginRequestData) {
    const res = await fetch(`http://127.0.0.1:8000/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    return res;
};

export async function registerRequest(data: RegisterRequestData) {
    const res = await fetch(`http://127.0.0.1:8000/v1/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    return res;
};
