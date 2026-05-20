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
                    className="flex items-center justify-center rounded-2xl"
                    style={{
                        width: 72,
                        height: 72,
                        background: "rgba(255,255,255,0.18)",
                        backdropFilter: "blur(10px)",
                    }}
                >
                    <ShanyrakIcon size={40} color="rgba(255,255,255,0.95)" />
                </div>
                <div className="min-w-0 flex-1">
                    <h1 className="text-lg font-bold text-white font-display">Войдите в аккаунт</h1>
                    <p className="mt-1 text-xs" style={{ color: "#A5F3FC" }}>
                        Сохранение маршрутов и синхронизация
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                        <Link
                            to="/sign-in"
                            className="rounded-xl px-4 py-2 text-xs font-bold text-white ring-1 ring-white/30 transition-opacity hover:opacity-90"
                            style={{ background: "rgba(255,255,255,0.22)" }}
                        >
                            Войти
                        </Link>
                        <Link
                            to="/sign-up"
                            className="rounded-xl px-4 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90"
                            style={{
                                background: `linear-gradient(135deg, ${GOLD}, #B8860B)`,
                                boxShadow: `0 4px 14px ${GOLD}55`,
                            }}
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
                            variables: { colorPrimary: TEAL, borderRadius: "0.75rem" },
                        }}
                    />
                </div>
                <div className="min-w-0 flex-1">
                    <h1 className="truncate text-lg font-bold text-white font-display">
                        {!isLoaded ? "…" : user?.fullName || user?.username || "Профиль"}
                    </h1>
                    <p className="mt-1 truncate text-xs" style={{ color: "#A5F3FC" }}>
                        {user?.primaryEmailAddress?.emailAddress || ""}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                        <div
                            className="flex w-fit items-center gap-1 px-2.5 py-1 rounded-full"
                            style={{ background: `${GOLD}35` }}
                        >
                            <span className="text-[10px] font-bold" style={{ color: "#FBBF24" }}>
                                Clerk
                            </span>
                        </div>
                        <SignOutButton redirectUrl="/">
                            <button
                                type="button"
                                className="rounded-full border border-white/40 bg-white/15 px-3 py-1 text-[11px] font-bold text-white transition-colors hover:bg-white/25"
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
