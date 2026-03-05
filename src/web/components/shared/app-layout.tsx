import type { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
    header: React.ReactNode,
}>

export default function AppLayout({ header, children }: Props) {
    return <main className="flex flex-col min-h-screen">
        <header className="bg-shell-100 p-2 h-10 flex justify-between gap-2 items-center">
            <h1 className="justify-self-start">Cumulus</h1>
            <div className="flex items-center gap-2">
                {header}
            </div>
        </header>
        <div className="flex-1">
            {children}
        </div>
    </main>
}
