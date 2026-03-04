import { type CreateCommit, type DeleteCommit, type UpdateCommit } from "@atcute/jetstream"
import { jetstream } from "./config";
import { tryCreateMarket } from "../db/index.ts";
import type { ActorIdentifier } from "@atcute/lexicons";

console.log(`> Connecting to ${jetstream.getOptions().url} and listening for events from ${jetstream.getOptions().wantedCollections?.join(', ')}`);

async function handleCreate(did: ActorIdentifier, commit: CreateCommit) {
    tryCreateMarket(did, commit);
}

async function handleUpdate(commit: UpdateCommit) {
    console.log("update", commit);
}

async function handleDelete(commit: DeleteCommit) {
    console.log("delete", commit);
}

for await (const event of jetstream) {
    if (event.kind === "commit") switch (event.commit.operation) {
        case "create": handleCreate(event.did, event.commit); break;
        case "update": handleUpdate(event.commit); break;
        case "delete": handleDelete(event.commit); break;
        default: throw new Error("Unknown Commit Type: " + event);
    }
}
