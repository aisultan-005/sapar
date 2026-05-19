import { Link } from "react-router-dom";
import { Show, SignOutButton, useUser, UserButton } from "@clerk/react";
import ShanyrakIcon from "../ui/ShanyrakIcon";
import { GOLD, TEAL } from "../../constants/theme";

export default function ClerkProfileHeader() {
    const { user, isLoaded } = useUser();

    return (
        <div className="relative z-10 flex items-center gap-4">
            <Show when="signed-out">
                <div
                    className="flex items-center justify-center"
                    style={{
                        width: 64,
                        height: 64,
                        background: "rgba(255,255,255,0.15)",
                    }}
                >
                    <ShanyrakIcon size={36} color="rgba(255,255,255,0.9)" />
                </div>
                <div className="min-w-0 flex-1">
                    <h1 className="text-lg font-bold text-white">Войдите в аккаунт</h1>
                    <p className="mt-1 text-xs" style={{ color: "#80e0eb" }}>
                        Сохранение маршрутов и синхронизация
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                        <Link
                            to="/sign-in"
                            className="rounded-lg px-4 py-2 text-xs font-bold text-white ring-1 ring-white/30 transition-opacity hover:opacity-90"
                            style={{ background: "rgba(255,255,255,0.2)" }}
                        >
                            Войти
                        </Link>
                        <Link
                            to="/sign-up"
                            className="rounded-lg px-4 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90"
                            style={{ background: `linear-gradient(135deg, ${GOLD}, #b8860b)` }}
                        >
                            Регистрация
                        </Link>
                    </div>
                </div>
            </Show>

            <Show when="signed-in">
                <div className="flex shrink-0 items-center">
                    <UserButton
                        afterSignOutUrl="/"
                        appearance={{
                            variables: { colorPrimary: TEAL },
                        }}
                    />
                </div>
                <div className="min-w-0 flex-1">
                    <h1 className="truncate text-lg font-bold text-white">
                        {!isLoaded ? "…" : user?.fullName || user?.username || "Профиль"}
                    </h1>
                    <p className="mt-1 truncate text-xs" style={{ color: "#80e0eb" }}>
                        {user?.primaryEmailAddress?.emailAddress || ""}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                        <div
                            className="flex w-fit items-center gap-1 px-2 py-1"
                            style={{ background: `${GOLD}30` }}
                        >
                            <span className="text-[10px] font-semibold" style={{ color: GOLD }}>
                                Clerk
                            </span>
                        </div>
                        <SignOutButton redirectUrl="/">
                            <button
                                type="button"
                                className="rounded-md border border-white/40 bg-white/10 px-3 py-1 text-[11px] font-bold text-white transition-colors hover:bg-white/20"
                            >
                                Выйти
                            </button>
                        </SignOutButton>
                    </div>
                </div>
            </Show>
        </div>
    );
}