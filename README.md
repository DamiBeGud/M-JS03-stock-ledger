# stock-ledger

JavaScript/Express application. Native setup `npm ci`; tests `npm test`.
Start `npm start`; PORT defaults to3203, all-interface listener.
Liveness `/health/live`; declared health/readiness `/ready`.
POST /movements {id,item,delta}; GET /stock/:item gives balance/history. Nonzero signed delta, unique immutable movement IDs; duplicate409.

Requires DATABASE_URL pointing to an assigned empty logical PostgreSQL database on the shared study server. Run `npm run migrate` to apply source versioned migrations. No CREATE DATABASE, drop/reset or startup auto-migration.

Tests use in-process domain fixtures and ephemeral loopback HTTP. DB repositories are replaced by test doubles; this is not PostgreSQL integration evidence.
AI-assisted researcher-authored application; shared scaffolding is disclosed outside this app. No deployment configuration is supplied.
