import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Auth from "./providers/auth-context-provider";
import './index.css'
import App from './app.tsx'
import Cumulus from './providers/cumulus-provider.tsx';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <Auth>
                <Cumulus>
                    <App />
                </Cumulus>
            </Auth>
        </QueryClientProvider>
    </StrictMode>
)
