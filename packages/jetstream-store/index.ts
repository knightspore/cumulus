import { JetstreamSubscription } from "@atcute/jetstream"

const URL = "wss://jetstream2.us-east.bsky.network";
const COLLECTIONS = ['za.co.ciaran.cumulus.bet', 'za.co.ciaran.cumulus.market', 'za.co.ciaran.cumulus.resolution']
const cursor = Date.now() * 1_000 - (36 * 60 * 60 * 1_000_000); // 36h in microseconds;

const subscription = new JetstreamSubscription({
    url: URL,
    wantedCollections: COLLECTIONS,
    cursor,
    onConnectionOpen: () => console.warn("> Connected to Jetstream: ", URL),
    onConnectionClose: () => console.warn("> Disconnected from Jetstream: ", URL),
    onConnectionError: (e) => console.error("> Error in Jetstream Subscription: ", e),
});

console.log(`> Connecting to ${URL} and listening for events from ${COLLECTIONS}`);

for await (const event of subscription) {
    if (event.kind === "commit") {
        console.log(event.kind, event.commit);
    }
}
