import { handleLogin, handleOauthCallback, handleRestoreSession } from "../lib/oauth";
import { isActorIdentifier, type ActorIdentifier } from "@atcute/lexicons/syntax";
import { useQuery } from "@tanstack/react-query";
import { createContext, useState, type PropsWithChildren, type SubmitEvent } from "react";
import { useSessionStorage } from "usehooks-ts";
import { AppBskyActorDefs } from "@atcute/bluesky";
import type { Client } from "@atcute/client";
import Avatar from "../components/shared/avatar";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Spinner } from "../components/ui/spinner";

interface AuthContext {
    profile: AppBskyActorDefs.ProfileViewDetailed,
    client: Client,
}

export const AuthContext = createContext<AuthContext | undefined>(undefined);

export default function Auth({ children }: PropsWithChildren) {

    const [identifier, setIdentifier] = useSessionStorage<ActorIdentifier | string>("user.did", "");
    const [isLoginLoading, setIsLoginLoading] = useState(false);

    async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoginLoading(true);
        await handleLogin(identifier)
    }

    const { data, isLoading } = useQuery({
        queryKey: ['auth.login'],
        queryFn: async () => {
            if (!isActorIdentifier(identifier)) throw new Error("Invalid identifier");

            const client = location.hash.slice(1).length > 1
                ? await handleOauthCallback()
                : await handleRestoreSession(identifier);

            if (!client) throw new Error("Error loading client");

            const { ok, data: profile } = await client.get('app.bsky.actor.getProfile', { params: { actor: identifier } })
            if (!ok) throw new Error("Failed to get actor profile");
            return { client, profile };

        },
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: () => Infinity,
    });

    const showLoader = !data && isLoading;
    const showLoginForm = !showLoader && !data && !isLoading;
    const showAppContent = !showLoginForm && data && !isLoading;

    return <main className="subpixel-antialiased text-shell-900 bg-shell-50 flex flex-col h-screen">
        <header className="bg-shell-900 text-shell-50 p-2 h-10 flex justify-between gap-2 items-center">
            <h1 className="text-coral-500 justify-self-start uppercase text-xs font-extrabold">Cumulus</h1>
            <div className="flex items-center gap-2"><Avatar profile={data?.profile} /></div>
        </header>
        <div className="flex-1 overflow-y-scroll">
            {showLoginForm && <form onSubmit={handleSubmit} className="mt-2 max-w-sm mx-auto flex flex-col gap-2">
                <Input value={identifier} onChange={(e) => setIdentifier(e.target.value.toLowerCase().replaceAll(" ", ""))} autoComplete="username" placeholder="username.com" />
                <Button disabled={isLoginLoading} size="sm" type="submit">
                    {isLoginLoading && <Spinner />}
                    Login
                </Button>
            </form>}

            {showAppContent && <AuthContext.Provider value={{ profile: data.profile, client: data.client }}>
                {children}
            </AuthContext.Provider>}
        </div>
    </main>
}
