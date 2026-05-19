import { SignIn } from "@clerk/react";
import { Link, useNavigate } from "react-router-dom";
import { TEAL } from "../constants/theme";

export default function AuthSignInScreen() {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen flex-col bg-slate-50">
            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
                <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                    ← На главную
                </button>
                <Link to="/sign-up" className="text-sm font-semibold hover:underline" style={{ color: TEAL }}>
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
                            variables: { colorPrimary: TEAL },
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
