# Cumulus: An ATProto Prediction Market

Just for fun :)

```bash
├── Dockerfile              # Build scripts
├── generated/              # Generated files - lexicon, orm, etc.
├── src/
│   ├── core                # atproto api calls for record crud
│   ├── db                  # prisma config + migrations
│   ├── jetstream           # za.co.ciaran.cumulus.* indexer
│   ├── lexicon             # Cumulus Lexicons
│   ├── server              # Server (Client -> DB Endpoints, FE /src/web app)
│   └── web                 # Front end
```
