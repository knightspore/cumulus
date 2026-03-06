import { type CreateCommit, type DeleteCommit, type UpdateCommit } from "@atcute/jetstream"
import { tryCreateBet, tryCreateMarket, tryCreateResolution, tryDeleteBet, tryDeleteMarket, tryDeleteResolution } from "@/core/api"
import type { ActorIdentifier } from "@atcute/lexicons";
import { JetstreamSubscription } from "@atcute/jetstream"

const URL = "wss://jetstream2.us-east.bsky.network";
const COLLECTIONS = ['za.co.ciaran.cumulus.*']

export const jetstream = new JetstreamSubscription({
    url: URL,
    wantedCollections: COLLECTIONS,
    onConnectionOpen: () => console.log("> Connected to Jetstream: ", jetstream.getOptions().url),
    onConnectionClose: () => console.log("> Disconnected from Jetstream: ", jetstream.getOptions().url),
    onConnectionError: (e) => console.error("> Error in Jetstream Subscription: ", e),
});

console.log(`> Connecting to ${jetstream.getOptions().url} and listening for events from ${jetstream.getOptions().wantedCollections?.join(', ')}`);

async function handleCreate(did: ActorIdentifier, commit: CreateCommit) {
    console.log("Handling Create Commit:", commit.rkey);
    tryCreateMarket(did, commit);
    tryCreateBet(did, commit);
    tryCreateResolution(did, commit);
}

async function handleUpdate(did: ActorIdentifier, commit: UpdateCommit) {
    console.log("Handling Update Commit:", commit.rkey);
}

async function handleDelete(did: ActorIdentifier, commit: DeleteCommit) {
    tryDeleteMarket(did, commit);
    tryDeleteBet(did, commit);
    tryDeleteResolution(did, commit);
}

for await (const event of jetstream) {
    if (event.kind === "commit") switch (event.commit.operation) {
        case "create": handleCreate(event.did, event.commit); break;
        case "update": handleUpdate(event.did, event.commit); break;
        case "delete": handleDelete(event.did, event.commit); break;
        default: throw new Error("Unknown Commit Type: " + event);
    }
}
