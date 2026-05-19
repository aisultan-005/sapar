import { Link } from "react-router-dom";
import { Show, SignOutButton } from "@clerk/react";
import { LogOut, UserCircle } from "lucide-react";
import { TEAL } from "../../constants/theme";

export default function ProfileAccountClerk({ darkMode }) {
    const card = darkMode ? "dm-card" : "bg-white";
    const title = darkMode ? "dm-text" : "text-gray-700";
    const muted = darkMode ? "#94a3b8" : "#6b7280";

    return (
        <div
            className={`p-4 mb-3 ${card}`}
            style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
        >
            <div className="mb-3 flex items-center gap-2">
                <UserCircle size={16} color={TEAL} />
                <span className={`text-xs font-bold ${title}`}>Аккаунт</span>
            </div>

            <Show when="signed-out">
                <p className="mb-3 text-sm" style={{ color: muted }}>
                    Войдите или зарегистрируйтесь, чтобы сохранять маршруты и синхронизировать данные.
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                    <Link
                        to="/sign-in"
                        className="flex-1 rounded-lg border-2 bg-transparent py-2.5 text-center text-xs font-bold transition-opacity hover:opacity-90"
                        style={{ color: TEAL, borderColor: TEAL }}
                    >
                        Войти
                    </Link>
                    <Link
                        to="/sign-up"
                        className="flex-1 rounded-lg py-2.5 text-center text-xs font-bold text-white transition-opacity hover:opacity-90"
                        style={{ background: TEAL, boxShadow: `0 2px 8px ${TEAL}40` }}
                    >
                        Регистрация через Clerk
                    </Link>
                </div>
            </Show>

            <Show when="signed-in">
                <p className="mb-3 text-sm" style={{ color: muted }}>
                    Вы вошли в аккаунт. Выход завершит сессию на этом устройстве.
                </p>
                <SignOutButton redirectUrl="/">
                    <button
                        type="button"
                        className="flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold text-white transition-opacity hover:opacity-95"
                        style={{
                            background: "#b91c1c",
                            boxShadow: "0 2px 12px rgba(185,28,28,0.35)",
                        }}
                    >
                        <LogOut size={14} />
                        Выйти из аккаунта
                    </button>
                </SignOutButton>
            </Show>
        </div>
    );
}
