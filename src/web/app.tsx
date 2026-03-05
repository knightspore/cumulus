import { useAuth } from "./providers/useAuth";


export default function App() {
    const { profile } = useAuth();
    return <div>
        Logged in as {profile.displayName} (@{profile.handle})
        <pre>
            {JSON.stringify(profile, null, 2,)}
        </pre>
    </div>
}
