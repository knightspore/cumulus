import { type CreateCommit, type DeleteCommit, type UpdateCommit } from "@atcute/jetstream"
import { jetstream } from "./config";
import { tryCreateBet, tryCreateMarket, tryCreateResolution, tryDeleteBet, tryDeleteMarket, tryDeleteResolution } from "@/core/api"
import type { ActorIdentifier } from "@atcute/lexicons";

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
