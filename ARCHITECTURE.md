# PoWV Public Reference Architecture

## 1. Purpose

This document defines the public component model, trust boundaries and evidence semantics for the PoWV physical-to-digital verification prototype. It is intended for architecture review, security review and integration planning.

The public repository is an observability client. It is not an authoritative verifier and does not contain the operational Virtual Lab services.

## 2. Component model

| Component | Responsibility | Authoritative output |
| --- | --- | --- |
| Physical source | Produce a measurement from the instrument interface. | Raw device response |
| Host bridge | Parse the response, normalize units and attach configured metadata. | Normalized event |
| PoWV-SBD encoder | Serialize canonical fields and the device signature into a fixed-size packet. | Binary event packet |
| Edge gateway | Validate packet structure, obtain the registered public key, verify the signature and enforce replay controls. | Acceptance or rejection result |
| Audit service | Append accepted event identifiers and calculate the current Merkle root. | Audit record and root |
| Evidence layer | Preserve append-only review material. | Signed local evidence |
| Public console | Report sanitized fixture data and read-only service state. | Non-authoritative observability view |

## 3. Processing sequence

1. The instrument produces a measurement response.
2. The host bridge parses and normalizes the response.
3. The encoder constructs the canonical unsigned byte sequence.
4. The device identity signs the unsigned sequence with ECDSA P-256.
5. The gateway decodes the packet and verifies the exact received unsigned bytes.
6. The gateway checks `(device_id, event_id)` against committed and in-flight replay state.
7. The validated event identifier is forwarded to the audit service.
8. The audit service appends the record and calculates the updated Merkle root.
9. Evidence outputs are retained for subsequent verification.

Business interpretation, settlement and tokenization are downstream concerns and are not part of this verification sequence.

## 4. Trust boundaries

### 4.1 Browser client

The browser is untrusted. It must not receive device private keys, administrative credentials, signing authority or unrestricted audit data. Its connected mode is limited to deliberately exposed read-only endpoints.

### 4.2 Host bridge

The bridge is responsible for acquisition and normalization. A host-generated SHA-256 identifier provides change detection for the normalized event but does not authenticate the physical source by itself.

### 4.3 Edge gateway

The gateway is the authoritative cryptographic acceptance boundary. Verification must operate on the exact unsigned bytes received in the packet. Reconstructed data structures are not an equivalent signature input.

### 4.4 Device registry

Public keys are resolved by device identity from the audit-side registry. Registration is an administrative operation and must not be exposed through the public client.

### 4.5 Audit service

The current audit chain is a laboratory data structure. Its Merkle root summarizes local state. It does not, without an independently verifiable anchor receipt, prove publication to an external ledger.

### 4.6 Physical integration

The Urano integration is host-mediated. The computer reads the serial response and transmits the normalized event to an ESP32 HTTP endpoint. HTTP acceptance confirms receipt only; it is not equivalent to gateway signature verification or durable audit ingestion.

## 5. Evidence semantics

| Signal | Supported interpretation | Excluded interpretation |
| --- | --- | --- |
| Event SHA-256 | Identifier of the canonical normalized event | Device authentication |
| ECDSA P-256 result | Signature validity for the exact verified bytes and registered public key | Accuracy of the physical measurement |
| Replay-control result | Event identifier was not previously committed or concurrently reserved | Global uniqueness outside the verifier state |
| Merkle root | Digest of the audit service's accepted event identifiers | Public-blockchain inclusion |
| HTTP 2xx from ESP32 | Endpoint received and accepted the request | Cryptographic acceptance or persistence |
| Provisioned location | Installation metadata supplied by configuration | Live or independently attested GNSS position |

## 5.1 Verification-control identifiers

| Control ID | Verification objective | Current authority | Public evidence |
| --- | --- | --- | --- |
| `ACQ-01` | Preserve the measurement returned by the instrument interface. | Host bridge | Sanitized event schema only |
| `ENC-01` | Produce one canonical unsigned byte sequence. | PoWV-SBD encoder | Packet-profile description |
| `SIG-01` | Verify ECDSA P-256 over the exact received unsigned bytes. | Edge gateway | Laboratory-validated capability status |
| `RPL-01` | Reject committed or concurrently reserved event identifiers. | Edge gateway | Retry-safe replay-control status |
| `AUD-01` | Append accepted identifiers and calculate the resulting Merkle root. | Audit service | Read-only audit summary when configured |
| `PUB-01` | Prevent the public client from acquiring signing or administrative authority. | Deployment boundary | Source inspection and security policy |

Control identifiers are stable review references, not certification claims. A control is considered externally demonstrated only when the referenced revision and its reproducible evidence are supplied together.

## 6. Runtime profiles

| Profile | Entry condition | Data source |
| --- | --- | --- |
| Fixture | No endpoint configured | Deterministic synthetic event and service state |
| Partial | At least one configured request fails | Per-service request outcomes plus synthetic event fixture |
| Connected | Gateway and audit health requests succeed | Live health/audit summary plus synthetic event fixture |

The current public client does not expose a live event stream. Connected mode must not be interpreted as end-to-end event verification.

## 7. Public-release constraints

The public source tree must exclude:

- private keys, seed material and signing credentials;
- administrative tokens and authorization headers;
- Wi-Fi credentials and private network topology;
- exact installation coordinates;
- raw operational sensor frames;
- customer, asset and industrial-pilot identifiers;
- unsupported claims of certification, deployment or external-ledger publication.

All `VITE_*` configuration values are client-visible and must be treated as public.

## 8. Current limitations

- Laboratory audit state is process-local and is not production-durable.
- Browser access requires an explicit CORS policy on each configured service.
- The public console reports endpoint reachability but does not validate response signatures.
- The Urano acquisition path is experimental and host-mediated.
- MQTT/TLS and RS-485 transport profiles are not implemented in this repository.
- No public-ledger anchoring receipt or tokenization contract is provided.

## 9. Engineering priorities

1. Define a versioned event and health-contract schema shared across services.
2. Add authenticated, read-only observability endpoints with explicit CORS policy.
3. Introduce durable audit persistence and restart-recovery tests.
4. Specify MQTT/TLS and RS-485 transport profiles, including replay and failure semantics.
5. Define an independently verifiable anchor receipt before making external-ledger claims.
