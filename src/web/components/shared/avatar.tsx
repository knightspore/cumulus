import type { AppBskyActorDefs } from "@atcute/bluesky";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer";
import { logout } from "@/web/lib/oauth";

export default function Avatar({ profile }: { profile?: AppBskyActorDefs.ProfileViewDetailed }) {
    if (!profile) return null;
    return <Drawer>
        <DrawerTrigger className="flex items-center gap-2 text-sm text-coral-500 tracking-tight">
            <img src={profile.avatar} className="h-5 rounded-full border border-coral-500" />
            <p>@{profile.handle}</p>
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
