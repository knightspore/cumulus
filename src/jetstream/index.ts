import { JetstreamSubscription } from "@atcute/jetstream"

const URL = "wss://jetstream2.us-east.bsky.network";
const COLLECTIONS = ['za.co.ciaran.cumulus.*']

const subscription = new JetstreamSubscription({
    url: URL,
    wantedCollections: COLLECTIONS,
    onConnectionOpen: () => console.warn("> Connected to Jetstream: ", subscription.getOptions().url),
    onConnectionClose: () => console.warn("> Disconnected from Jetstream: ", subscription.getOptions().url),
    onConnectionError: (e) => console.error("> Error in Jetstream Subscription: ", e),
});

console.log(`> Connecting to ${subscription.getOptions().url} and listening for events from ${subscription.getOptions().wantedCollections?.join(', ')}`);

for await (const event of subscription) {
    if (event.kind === "commit") {
        console.log(event.kind, event.commit);
    }
}
