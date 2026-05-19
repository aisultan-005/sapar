import { Routes, Route, Navigate } from "react-router-dom";

import SaparMainShell from "./components/layout/SaparMainShell";
import AuthSignInScreen from "./screens/AuthSignInScreen";
import AuthSignUpScreen from "./screens/AuthSignUpScreen";
import { showClerk } from "./constants/clerk";

export default function App() {
    return (
        <Routes>
            <Route
                path="/sign-in/*"
                element={showClerk ? <AuthSignInScreen /> : <Navigate to="/" replace />}
            />
            <Route
                path="/sign-up/*"
                element={showClerk ? <AuthSignUpScreen /> : <Navigate to="/" replace />}
            />
            <Route path="/*" element={<SaparMainShell />} />
        </Routes>
    );
}
