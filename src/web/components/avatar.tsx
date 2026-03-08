import type { AppBskyActorDefs } from "@atcute/bluesky";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/web/components/ui/drawer";
import { logout } from "@/web/lib/oauth";

export default function Avatar({ profile }: { profile: AppBskyActorDefs.ProfileViewDetailed }) {
    return <Drawer>
        <DrawerTrigger className="flex items-center gap-2 text-sm text-coral-500 tracking-tight" disabled={!profile}>
            <img src={profile.avatar} className="size-5 rounded-full border border-coral-500 bg-coral-900" />
            <p className="flex items-center">@{profile.handle}</p>
        </DrawerTrigger>
        <DrawerContent>
            <DrawerHeader><DrawerTitle>Profile</DrawerTitle></DrawerHeader>
            <ul className="p-8 space-y-2">
                <li><a href={`https://bsky.app/profile/${profile.handle}`} target="_blank">BlueSky Profile</a></li>
                <li><button onClick={() => logout(profile.did)}>Logout</button></li>
            </ul>
        </DrawerContent>
    </Drawer>
}
