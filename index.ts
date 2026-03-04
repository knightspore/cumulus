import type { ActorIdentifier } from "@atcute/lexicons";
import { createBet, createMarket, createResolution } from "./src/core";
import { Client } from '@atcute/client';
import { PasswordSession } from "@atcute/password-session";
import { ComAtprotoRepoStrongRef } from "@atcute/atproto";

const creds = {
    handle: process.env.HANDLE as ActorIdentifier,
    pw: process.env.APP_PASS as string,
}

const client = new Client({
    handler: await PasswordSession.login({
        service: 'https://bsky.social',
        identifier: creds.handle,
        password: creds.pw,
    })
});

const marketRecord = await createMarket("What will I do?", 50, new Date((new Date()).setMonth(4)).toISOString(), creds.handle, client);
console.log("market", marketRecord);

const marketRef: ComAtprotoRepoStrongRef.Main = {
    $type: "com.atproto.repo.strongRef",
    uri: marketRecord.uri,
    cid: marketRecord.cid,
}
console.log("marketRef", marketRef);

const betRecord = await createBet(marketRef, "yes", creds.handle, client);
console.log("bet", betRecord);

const resolutionRecord = await createResolution(marketRef, "yes", creds.handle, client);
console.log("resolution", resolutionRecord);
