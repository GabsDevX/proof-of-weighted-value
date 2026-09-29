# Public architecture and evidence boundary

## Objective

The PoWV verification model separates physical observation, cryptographic acceptance, audit storage and later business interpretation. These responsibilities must not be collapsed into a single “blockchain verified” claim.

## Reference sequence

| Stage | Responsibility | Public console treatment |
| --- | --- | --- |
| Physical event | A sensor or scale produces a measurement. | Sanitized demonstration fixture. |
| Host bridge | Serial data is parsed and normalized. | Architectural representation only. |
| Compact proof | Identity, event data and integrity material are serialized. | PoWV-SBD laboratory profile summary. |
| Edge validation | Format, signature and replay rules are evaluated. | Optional gateway health check. |
| Audit chain | Accepted event hashes update a Merkle root. | Optional audit summary. |
| Evidence anchor | A signed append-only record supports later verification. | Status only; evidence files remain private. |
| Interpretation | Domain rules determine business meaning. | Outside the verification core. |
| Tokenization | A verified asset may be represented in a settlement layer. | Roadmap; not implemented here. |

## Trust boundaries

### Browser

The public browser is untrusted. It may display public state but must never receive device private keys, administrative tokens or signing authority.

### Edge gateway

The gateway is responsible for validating the exact signed bytes, retrieving the registered public key and enforcing replay rules. A frontend notification is not a substitute for gateway acceptance.

### Audit service

The laboratory audit service maintains local state and calculates a Merkle root. Its current local evidence model does not prove publication to a public blockchain.

### Physical integration

The Urano laboratory integration is host-mediated: the computer reads the serial response, normalizes the event, calculates its integrity identifier and forwards it to a configured ESP32 HTTP endpoint. That HTTP receipt does not independently establish signature verification or durable anchoring.

## Public release rules

The public repository must not contain:

- private or public operational keys;
- access tokens, Wi-Fi credentials or administrative headers;
- exact installation coordinates;
- private network addresses;
- raw production sensor frames;
- customer, asset or industrial-pilot identifiers;
- claims of deployed functionality unsupported by executable code.

## Roadmap

1. Define a versioned public event contract shared by the console and gateway adapter.
2. Add a read-only event stream designed for browser consumption.
3. Implement authenticated MQTT/TLS and industrial RS-485 transport profiles.
4. Add durable audit persistence and operational observability.
5. Evaluate tokenization only after the evidence contract and custody model are stable.

