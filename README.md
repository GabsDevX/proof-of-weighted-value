# PoWV Protocol — Verification Reference

Public reference implementation for the PoWV physical-to-digital verification architecture.

| Attribute | Value |
| --- | --- |
| Repository role | Read-only observability client and architecture reference |
| Maturity | Experimental; not production-qualified |
| Runtime | Deterministic fixture or explicitly configured local services |
| Trust model | The browser is untrusted and holds no signing authority |

This repository documents the externally reviewable system boundary. Operational services, device credentials, private network topology, installation coordinates and production evidence remain outside the public source tree.

## Scope

The client exposes a constrained view of the laboratory pipeline:

1. physical measurement acquisition;
2. serial parsing and event normalization;
3. canonical binary encoding;
4. ECDSA P-256 verification at the edge;
5. replay control by device and event identifier;
6. audit ingestion and Merkle-root calculation;
7. evidence-state reporting.

The browser does not sign events, register devices, authorize administrative operations or submit ledger transactions.

## System model

| Stage | Control | Public representation |
| --- | --- | --- |
| Physical source | Produces a measurement through the scale interface. | Deterministic sanitized fixture |
| Host bridge | Parses serial data and normalizes the event schema. | Architecture and event schema |
| PoWV-SBD encoder | Produces the canonical unsigned body and fixed-size packet. | Packet profile metadata |
| Edge gateway | Validates structure, device identity, signature and replay state. | Optional read-only health status |
| Audit service | Accepts validated event identifiers and calculates the current Merkle root. | Optional read-only audit summary |
| Evidence layer | Maintains append-only evidence for subsequent review. | Capability status only |

See [ARCHITECTURE.md](ARCHITECTURE.md) for component boundaries, evidence semantics and non-claims.

## Repository layout

| Path | Responsibility |
| --- | --- |
| `App.tsx` | Application composition and runtime-state presentation |
| `components/` | Pipeline, event, status and capability views |
| `services/labService.ts` | Read-only adapter for configured laboratory endpoints |
| `types.ts` | Public client-side data contracts |
| `ARCHITECTURE.md` | Reference architecture and trust boundaries |
| `SECURITY.md` | Threat model and vulnerability-reporting requirements |
| `.github/workflows/ci.yml` | Type-check and production-build validation |

## Runtime profiles

### Fixture

Used when no endpoint is configured. The event record is deterministic, synthetic and cryptographically self-consistent. It is not operational evidence.

### Partial

Used when one or more configured endpoints fail or remain unavailable. Each service is reported independently.

### Connected

Used when the configured gateway and audit health endpoints return successful JSON responses. Connected status represents endpoint reachability only. The current client does not consume a signed event feed.

## Configuration

Requirements: Node.js 20 or later.

```bash
npm ci
npm run dev
```

For local service integration, create `.env.local`:

```dotenv
VITE_POWV_GATEWAY_URL=http://127.0.0.1:5002
VITE_POWV_AUDIT_URL=http://127.0.0.1:5003
```

The adapter requests:

- `GET /` on the edge gateway;
- `GET /` on the audit service;
- `GET /merkle_root` on the audit service.

The target services must implement the required CORS policy. Every `VITE_*` value is embedded in the client bundle and therefore must be treated as public configuration.

## Verification

```bash
npm run check
npm run build
```

The continuous-integration workflow executes both commands for pull requests and updates to `main`.

## Evidence semantics

- A SHA-256 value identifies the canonical event representation; it is not a device signature.
- A successful HTTP health request establishes service reachability; it does not establish event authenticity.
- An ECDSA verification result is authoritative only when produced by the edge verifier over the exact unsigned byte sequence.
- A local Merkle root summarizes the audit service state; it does not establish inclusion in a public blockchain.
- Location metadata is provisioned unless an authenticated GNSS source and accuracy record are explicitly present.

## Implementation status

Laboratory-validated controls include the PoWV-SBD fixed-size packet, ECDSA P-256 verification, device-key lookup, SHA-256 event identification and retry-safe replay handling. The Urano host bridge and ESP32 delivery path remain experimental. MQTT/TLS, industrial RS-485 profiles, durable production storage, public-ledger anchoring and tokenization remain outside the implemented public scope.

## Security and disclosure

The repository must not contain device private keys, administrative tokens, Wi-Fi credentials, private endpoints, exact installation coordinates, raw operational frames or customer identifiers. Review [SECURITY.md](SECURITY.md) before exposing any laboratory endpoint to a browser client.

## License

No open-source license is granted. Copyright © 2026 Gabriel de Almeida Santos Silva. All rights reserved.

