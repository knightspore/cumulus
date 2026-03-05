import { useContext } from "react";
import { CumulusContext } from "./cumulus-provider";

export function useCumulus() {
    const value = useContext(CumulusContext) 
    if (value === undefined) {
        throw new Error("useCumulus must be used within Cumulus Provider");
    }
    return value;
}
