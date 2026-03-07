import { type CreateCommit, type DeleteCommit } from "@atcute/jetstream"
import { tryCreateBet, tryCreateMarket, tryCreateResolution, tryDeleteBet, tryDeleteMarket, tryDeleteResolution } from "@/core/api"
import type { Did } from "@atcute/lexicons";
import { JetstreamSubscription } from "@atcute/jetstream"
import { createUri } from "@/core/utils";

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

async function handleCreate(did: Did, commit: CreateCommit) {
    console.log("Handling Create Commit:", createUri(did, commit.collection, commit.rkey));
    await tryCreateMarket(did, commit);
    await tryCreateBet(did, commit);
    await tryCreateResolution(did, commit);
}

async function handleDelete(did: Did, commit: DeleteCommit) {
    console.log("Handling Delete Commit:", createUri(did, commit.collection, commit.rkey));
    await tryDeleteMarket(did, commit);
    await tryDeleteBet(did, commit);
    await tryDeleteResolution(did, commit);
}

for await (const event of jetstream) {
    if (event.kind === "commit") switch (event.commit.operation) {
        case "create": handleCreate(event.did, event.commit); break;
        case "delete": handleDelete(event.did, event.commit); break;
        default: break;
    }
}
