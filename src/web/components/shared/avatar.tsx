import { Badge } from "../ui/badge";
import type { AppBskyActorDefs } from "@atcute/bluesky";

export default function Avatar({ profile }: { profile?: AppBskyActorDefs.ProfileViewDetailed }) {
    if (!profile) return null;
    return <Badge variant="link">
        <img src={profile.avatar} className="h-4 rounded-full" />
        <a href={`https://bsky.app/profile/${profile.handle}`} target="_blank">@{profile.handle}</a>
    </Badge>
}
