import { configureOAuth, createAuthorizationUrl, deleteStoredSession, finalizeAuthorization, getSession, OAuthUserAgent } from '@atcute/oauth-browser-client';

import {
    CompositeDidDocumentResolver,
    LocalActorResolver,
    PlcDidDocumentResolver,
    WebDidDocumentResolver,
    XrpcHandleResolver,
} from '@atcute/identity-resolver';
import type { ActorIdentifier, Did, Handle } from '@atcute/lexicons';
import { Client } from '@atcute/client';

configureOAuth({
    metadata: {
        client_id: import.meta.env.VITE_OAUTH_CLIENT_ID!,
        redirect_uri: import.meta.env.VITE_OAUTH_REDIRECT_URI!,
    },
    identityResolver: new LocalActorResolver({
        handleResolver: new XrpcHandleResolver({
            serviceUrl: 'https://public.api.bsky.app',
        }),
        didDocumentResolver: new CompositeDidDocumentResolver({
            methods: {
                plc: new PlcDidDocumentResolver(),
                web: new WebDidDocumentResolver(),
            },
        }),
    }),
});

export async function login(did: ActorIdentifier) {
    console.log("Logging in:", did);
    const url = await createAuthorizationUrl({
        target: { type: 'account', identifier: did },
        scope: 'atproto transition:generic',
    });
    await new Promise(resolve => setTimeout(resolve, 200));
    window.location.assign(url);
}

export async function logout(did: Did) {
    console.log("Logging out:", did);
    try {
        const session = await getSession(did, { allowStale: true });
        const agent = new OAuthUserAgent(session);
        await agent.signOut();
    } catch {
        console.log("Error singing out, deleting session");
        deleteStoredSession(did);
    }
}

export async function handleOauthCallback() {
    console.log("Handling auth callback...");

    const params = new URLSearchParams(location.hash.slice(1));

    history.replaceState(null, '', "/");

    const { session } = await finalizeAuthorization(params);
    const agent = new OAuthUserAgent(session);
    const rpc = new Client({ handler: agent });

    console.log("Initialised new client");

    return rpc;
}

export async function handleRestoreSession(did: Did) {
    try {
        const session = await getSession(did, { allowStale: true });
        const agent = new OAuthUserAgent(session);
        return new Client({ handler: agent });
    } catch (e) {
        logout(did)
    }
}
