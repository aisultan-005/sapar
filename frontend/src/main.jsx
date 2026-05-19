import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/react";
import App from "./App";
import ClerkApiTokenBridge from "./components/auth/ClerkApiTokenBridge";
import "./styles/global.css";

const clerkPk = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY?.trim();

const root = createRoot(document.getElementById("root"));

root.render(
    <StrictMode>
        <BrowserRouter>
            {clerkPk ? (
                <ClerkProvider
                    publishableKey={clerkPk}
                    signInUrl="/sign-in"
                    signUpUrl="/sign-up"
                    afterSignInUrl="/"
                    afterSignUpUrl="/"
                >
                    <ClerkApiTokenBridge />
                    <App />
                </ClerkProvider>
            ) : (
                <App />
            )}
        </BrowserRouter>
    </StrictMode>
);
