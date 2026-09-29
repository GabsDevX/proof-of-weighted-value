# PoWV Verification Reference

The PoWV Verification Reference is a public, read-only client for inspecting the physical-to-digital verification model used in the PoWV laboratory environment. It documents the verification path and exposes sanitized runtime status without embedding device credentials, signing authority, or private operational data.

## Laboratory environment

The PoWV laboratory environment is a controlled integration stack used to exercise the complete lifecycle of a physical measurement: device acquisition, event normalization, canonical encoding, edge verification, replay control, audit ingestion, and evidence inspection. Its purpose is to validate interfaces, trust boundaries, failure behavior, and evidence semantics before an industrial pilot or production deployment.

## Repository status

| Item | Status |
| --- | --- |
| Purpose | Architecture reference and observability client |
| Maturity | Experimental; not production-qualified |
| Event data | Deterministic synthetic fixture unless local services are configured |
| Verification authority | Edge gateway; never the browser client |
| Operational backend | Maintained outside this public repository |

This repository is designed for technical review. It does not represent a production deployment, certification, public-ledger integration, or tokenization system.

## Verification flow

1. A physical instrument produces a measurement.
2. A host bridge parses the device response and normalizes the event.
3. The PoWV-SBD encoder produces the canonical unsigned byte sequence and fixed-size event packet.
4. The edge gateway resolves the registered device key, verifies the ECDSA P-256 signature, and applies replay controls.
5. The audit service records the accepted event identifier and recalculates the Merkle root.
6. The evidence layer retains material required for subsequent integrity review.

Business interpretation, settlement, and tokenization are downstream concerns and are not part of this verification path.

## Component responsibilities

| Component | Responsibility | Authoritative output |
| --- | --- | --- |
| Physical source | Produce the source measurement through the instrument interface. | Device response |
| Host bridge | Parse the response, normalize units, and attach provisioned metadata. | Normalized event |
| PoWV-SBD encoder | Serialize the canonical fields and device signature. | Fixed-size binary packet |
| Edge gateway | Validate structure, device identity, signature, and replay state. | Acceptance or rejection result |
| Audit service | Record accepted event identifiers and calculate the current Merkle root. | Audit record and root |
| Evidence layer | Retain append-only material for later review. | Reviewable evidence |
| Public client | Display sanitized fixture data and read-only service status. | Non-authoritative observability view |

For the complete trust-boundary and data-flow specification, see [ARCHITECTURE.md](ARCHITECTURE.md).

## Implementation status

| Capability | Status | Scope |
| --- | --- | --- |
| PoWV-SBD fixed-size packet | Laboratory validated | Operational Virtual Lab |
| ECDSA P-256 verification | Laboratory validated | Edge gateway |
| Device-key lookup | Laboratory validated | Device registry and gateway |
| Retry-safe replay control | Laboratory validated | Edge gateway |
| Local audit state and Merkle-root calculation | Laboratory validated | Audit service |
| Urano serial acquisition and ESP32 HTTP delivery | Experimental | Host-mediated hardware path |
| Public observability client | Implemented | This repository |
| MQTT/TLS transport profile | Not implemented | Planned work |
| Industrial RS-485 profile | Not implemented | Planned work |
| Durable production audit storage | Not implemented | Planned work |
| External-ledger anchoring | Not implemented | No public anchor receipt is produced |
| Tokenization contracts | Not implemented | Outside the current verification scope |

“Laboratory validated” refers to controlled testing of the relevant component. It does not imply production readiness, independent certification, or deployment in an industrial facility.

## Runtime modes

The client reports one of three runtime modes:

| Mode | Meaning |
| --- | --- |
| `fixture` | No service endpoint is configured. The interface uses a deterministic synthetic event. |
| `partial` | At least one configured endpoint is unavailable or returns an invalid response. |
| `connected` | The configured gateway and audit health endpoints return successful JSON responses. |

`connected` confirms endpoint reachability only. The current public client does not consume or verify a live signed-event stream.

## Run locally

Requirements: Node.js 20 or later.

```bash
npm ci
npm run dev
```

The development server binds to `127.0.0.1:5173` and does not expose itself to the local network by default.

## Connect local laboratory services

Create `.env.local`:

```dotenv
VITE_POWV_GATEWAY_URL=http://127.0.0.1:5002
VITE_POWV_AUDIT_URL=http://127.0.0.1:5003
```

The adapter performs read-only requests to:

- `GET /` on the edge gateway;
- `GET /` on the audit service;
- `GET /merkle_root` on the audit service.

Configured services must provide an explicit CORS policy. All `VITE_*` values are embedded in the browser bundle and must be treated as public configuration; never place credentials or secrets in these variables.

## Validate the repository

```bash
npm run check
npm run build
npm audit --omit=dev --audit-level=high
```

The GitHub Actions workflow runs the same type-check, production build, and production-dependency audit for pull requests and changes to `main`.

## Evidence interpretation

| Signal | What it establishes | What it does not establish |
| --- | --- | --- |
| Event SHA-256 | Identity of the canonical normalized event | Device authenticity or measurement accuracy |
| ECDSA P-256 verification | Signature validity for the exact verified bytes and registered public key | Accuracy of the physical source |
| Replay-control result | The event identifier was not already committed or concurrently reserved | Global uniqueness outside the verifier state |
| Merkle root | Digest of the audit service's accepted event identifiers | Inclusion in a public blockchain |
| HTTP `2xx` from the ESP32 | Request acceptance by the ESP32 endpoint | Cryptographic verification or durable persistence |
| Provisioned location | Installation metadata supplied through configuration | Live or independently attested GNSS position |

## Repository structure

| Path | Responsibility |
| --- | --- |
| `App.tsx` | Application composition and runtime-state presentation |
| `components/` | Verification stages, event record, service status, and capability views |
| `services/labService.ts` | Bounded read-only adapter for configured laboratory endpoints |
| `types.ts` | Immutable public client data contracts |
| `ARCHITECTURE.md` | Component model, trust boundaries, and evidence semantics |
| `SECURITY.md` | Security model, deployment requirements, and vulnerability reporting |
| `.github/workflows/ci.yml` | Automated type-check, build, and dependency-audit validation |

## Security

The public source tree must not contain device private keys, administrative tokens, Wi-Fi credentials, private endpoints, exact installation coordinates, raw operational frames, customer identifiers, or production evidence.

Review [SECURITY.md](SECURITY.md) before connecting the client to any laboratory service or reporting a vulnerability.

## License

No open-source license is granted. Copyright © 2026 Gabriel de Almeida Santos Silva. All rights reserved.
