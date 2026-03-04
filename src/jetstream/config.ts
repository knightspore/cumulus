import { JetstreamSubscription } from "@atcute/jetstream"

const URL = "wss://jetstream2.us-east.bsky.network";
const COLLECTIONS = ['za.co.ciaran.cumulus.*']

export const jetstream = new JetstreamSubscription({
    url: URL,
    wantedCollections: COLLECTIONS,
    onConnectionOpen: () => console.warn("> Connected to Jetstream: ", jetstream.getOptions().url),
    onConnectionClose: () => console.warn("> Disconnected from Jetstream: ", jetstream.getOptions().url),
    onConnectionError: (e) => console.error("> Error in Jetstream Subscription: ", e),
});
