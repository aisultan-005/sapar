import { SignIn } from "@clerk/react";
import { Link, useNavigate } from "react-router-dom";
import { TEAL } from "../constants/theme";

export default function AuthSignInScreen() {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen flex-col" style={{ background: "#FAFAF7" }}>
            <div
                className="flex shrink-0 items-center justify-between bg-white px-4 py-3"
                style={{ borderBottom: "1px solid #F1F0EC" }}
            >
                <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="text-sm font-semibold rounded-full px-3 py-1.5 transition-colors hover:bg-slate-100"
                    style={{ color: "#475569" }}
                >
                    ← На главную
                </button>
                <Link
                    to="/sign-up"
                    className="text-sm font-bold hover:underline"
                    style={{ color: TEAL }}
                >
                    Регистрация
                </Link>
            </div>
            <div className="flex flex-1 items-start justify-center overflow-y-auto p-4 pb-8">
                <div className="w-full max-w-md pt-2">
                    <SignIn
                        routing="path"
                        path="/sign-in"
                        signUpUrl="/sign-up"
                        forceRedirectUrl="/"
                        appearance={{
                            variables: { colorPrimary: TEAL, borderRadius: "0.875rem" },
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
