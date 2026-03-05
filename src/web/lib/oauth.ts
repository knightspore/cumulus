import { configureOAuth, createAuthorizationUrl, deleteStoredSession, finalizeAuthorization, getSession, OAuthUserAgent } from '@atcute/oauth-browser-client';
import { CompositeDidDocumentResolver, LocalActorResolver, PlcDidDocumentResolver, WebDidDocumentResolver, XrpcHandleResolver } from '@atcute/identity-resolver';
import type { ActorIdentifier } from '@atcute/lexicons';
import { Client } from '@atcute/client';
import { isActorIdentifier, isHandle } from '@atcute/lexicons/syntax';

const handleResolver = new XrpcHandleResolver({
    serviceUrl: 'https://public.api.bsky.app',
})

const didDocumentResolver = new CompositeDidDocumentResolver({
    methods: {
        plc: new PlcDidDocumentResolver(),
        web: new WebDidDocumentResolver(),
    },
})

configureOAuth({
    metadata: {
        client_id: import.meta.env.VITE_OAUTH_CLIENT_ID!,
        redirect_uri: import.meta.env.VITE_OAUTH_REDIRECT_URI!,
    },
    identityResolver: new LocalActorResolver({
        handleResolver,
        didDocumentResolver,
    }),
});

export async function handleLogin(did: ActorIdentifier| string) {
    if (!isActorIdentifier(did)) throw new Error("Invalid identifier");
    const url = await createAuthorizationUrl({
        target: { type: 'account', identifier: did },
        scope: 'atproto transition:generic',
    });
    await new Promise(resolve => setTimeout(resolve, 200));
    window.location.assign(url);
}

export async function logout(identifier: ActorIdentifier) {
    if (isHandle(identifier)) identifier = await handleResolver.resolve(identifier);
    try {
        const session = await getSession(identifier, { allowStale: true });
        const agent = new OAuthUserAgent(session);
        await agent.signOut();
    } catch {
        deleteStoredSession(identifier);
    }
}

export async function handleOauthCallback() {
    const params = new URLSearchParams(location.hash.slice(1));

    history.replaceState(null, '', "/");

    const { session } = await finalizeAuthorization(params);
    const agent = new OAuthUserAgent(session);
    const rpc = new Client({ handler: agent });

    return rpc;
}

export async function handleRestoreSession(identifier: ActorIdentifier) {
    if (isHandle(identifier)) identifier = await handleResolver.resolve(identifier);
    try {
        const session = await getSession(identifier, { allowStale: true });
        const agent = new OAuthUserAgent(session);
        return new Client({ handler: agent });
    } catch (e) {
        logout(identifier)
    }
}
