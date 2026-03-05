import type { AppBskyActorDefs } from "@atcute/bluesky";

export default function Avatar({ profile }: { profile?: AppBskyActorDefs.ProfileViewDetailed }) {
    if (!profile) return null;
    return <div className="flex items-center gap-2 text-sm text-coral-500 tracking-tight">
        <img src={profile.avatar} className="h-5 rounded-full border border-coral-500" />
        <a href={`https://bsky.app/profile/${profile.handle}`} target="_blank">@{profile.handle}</a>
    </div>
}
