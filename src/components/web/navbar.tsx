import Link from "next/link";
import { buttonVariants } from "../ui/button";

export function Navbar() {
    return (
        <nav className="w-full py-5 flex items-center justify-between">
            <div className="flex items-center gap-8">
                <Link href={"/"}>
                    <h1 className="text-3xl font-bold">
                        Planum
                    </h1>
                </Link>

                <div className="flex items-center gap-2">
                    <Link className={buttonVariants({ variant: "ghost" })} href={"/settings"}>
                        Настройки
                    </Link>
                    <Link className={buttonVariants({ variant: "ghost" })} href={"/profile"}>
                        Аккаунт
                    </Link>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Link className={buttonVariants()} href={"/auth/login"}>Войти</Link>
            </div>
        </nav>
    );
}
