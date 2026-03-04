import { handleOauthCallback, handleRestoreSession, login } from "./lib/oauth";
import { isActorIdentifier, type Did, type Handle } from "@atcute/lexicons/syntax";
import { useSessionStorage } from "usehooks-ts";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function App() {
    return <QueryClientProvider client={queryClient}>
        <Login />
    </QueryClientProvider >
}

function Login() {
    const [identifier, setIdentifier] = useSessionStorage<Handle | string>("user.did", "");

    const { data: client, isLoading, error } = useQuery({
        queryKey: ['auth.login'],
        queryFn: async () => {
            if (location.hash.slice(1).length > 1) {
                return handleOauthCallback()
            }
            if (identifier) {
                console.log("identifier check", identifier);
                return handleRestoreSession(identifier as Did)
            }
        },
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: () => Infinity,
        enabled: identifier !== ""
    });

    error && console.log(error.stack)

    async function handleLogin() {
        if (isActorIdentifier(identifier)) login(identifier)
    }

    return <div>
        {!client && <>
            <input type="text" value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
            {isLoading && "Loading..."}
        </>}
        {client && <p>Logged in!</p>}
        {error?.name && JSON.stringify(error, null, 2)}
    </div>
}
