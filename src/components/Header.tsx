import Link from "next/link";

interface HeaderProps {
    setIsLoged: (value: boolean) => void
}

export default function Header({ setIsLoged }: HeaderProps) {
    return (
        <header className="container z-40 bg-background">
            <div className="flex h-20 items-center justify-between py-6">
                <div>Planum</div>
                <Link href={"/login"} className="place-self-end">Войти</Link>
            </div>
        </header>
    );
}
