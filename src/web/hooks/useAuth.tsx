import { useContext } from "react";
import { AuthContext } from "@/web/providers/auth-context-provider";

export function useAuth() {
    const value = useContext(AuthContext);
    if (value === undefined) {
        throw new Error("useAuth must be used within Auth Provider");
    }
    return value;
}
