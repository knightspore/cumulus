import { handleLogin, handleOauthCallback, handleRestoreSession } from "../lib/oauth";
import { isActorIdentifier, type ActorIdentifier } from "@atcute/lexicons/syntax";
import { useQuery } from "@tanstack/react-query";
import { createContext, type PropsWithChildren } from "react";
import { useSessionStorage } from "usehooks-ts";
import { AppBskyActorDefs } from "@atcute/bluesky";
import type { Client } from "@atcute/client";
import AppLayout from "../components/shared/app-layout";
import Avatar from "../components/shared/avatar";

interface AuthContext {
    profile: AppBskyActorDefs.ProfileViewDetailed,
    client: Client,
}

export const AuthContext = createContext<AuthContext | undefined>(undefined);

export default function Auth({ children }: PropsWithChildren) {
    const [identifier, setIdentifier] = useSessionStorage<ActorIdentifier | string>("user.did", "");

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

    return <AppLayout header={<Avatar profile={data?.profile} />}>

        {data && !isLoading && <AuthContext.Provider value={{ profile: data.profile, client: data.client }}>
            {children}
        </AuthContext.Provider>}

        {!data && !isLoading && <form onSubmit={(e) => e.preventDefault()}>
            <input type="text" value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
            <button onClick={() => handleLogin(identifier)}>Login</button>
        </form>}

    </AppLayout>
}
