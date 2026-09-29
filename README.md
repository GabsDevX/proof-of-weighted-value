# PoWV Protocol — Public Verification Console

Public reference interface for the physical-to-digital verification model developed in the PoWV Virtual Lab.

This repository contains a **frontend observability console**. It explains and visualizes the current laboratory pipeline without publishing private endpoints, installation coordinates, credentials, device keys or operational evidence.

> **Status:** prototype and technical demonstration. This application is not an industrial control system, a token platform, an investment product or proof of publication on a public blockchain.

## What changed

The original repository presented token submission, claim and retirement forms backed by randomly generated transaction hashes. That behavior has been removed. The modernized console now represents the system that is actually being tested:

```text
physical measurement
  -> serial host bridge
  -> normalized event
  -> compact proof profile
  -> edge validation
  -> replay protection
  -> audit chain / Merkle root
  -> signed local evidence
```

The interface distinguishes three capability states:

- **Implemented:** behavior present in the laboratory codebase and covered by its technical flow.
- **Experimental:** hardware or integration work demonstrated in a controlled environment.
- **Roadmap:** planned transport, industrialization or tokenization work that is not claimed as complete.

## Public console features

- responsive physical-to-digital architecture view;
- explicit demo, partial and connected runtime states;
- service health cards for the physical bridge, edge gateway, audit chain and evidence anchor;
- sanitized physical-event example with SHA-256 identification;
- current audit summary and Merkle-root display;
- capability matrix separating implemented, experimental and roadmap work;
- optional read-only connection to configured laboratory health endpoints;
- no fabricated transaction hashes and no private keys in the browser.

## Run locally

Requirements: Node.js 20 or newer.

```bash
npm install
npm run dev
```

Build and type-check:

```bash
npm run check
npm run build
```

## Runtime modes

The console starts in **demo mode** when no endpoints are configured. Demo data is deterministic and visibly identified; it must not be interpreted as operational evidence.

For a controlled local environment, create `.env.local`:

```dotenv
VITE_POWV_GATEWAY_URL=http://127.0.0.1:5002
VITE_POWV_AUDIT_URL=http://127.0.0.1:5003
```

Only public health and audit-summary endpoints should be exposed to the browser. Do not place API tokens, signing keys, passwords, private hostnames or precise installation coordinates in `VITE_*` variables: Vite embeds these values in the client bundle.

The connected adapter reads:

- `GET /` from the edge gateway;
- `GET /` from the audit service;
- `GET /merkle_root` from the audit service.

Cross-origin access must be deliberately configured on the target services. The console does not bypass browser security controls.

## Relationship to the laboratory

The private laboratory currently explores:

- fixed-size compact binary events;
- ECDSA P-256 device signatures;
- device-key registration and lookup;
- replay protection;
- SHA-256 event identification;
- local audit-chain state and Merkle roots;
- append-only signed evidence;
- physical scale acquisition through a host bridge and ESP32 HTTP endpoint.

This public repository contains an interface and a safe architectural description, not a copy of operational laboratory data or private infrastructure.

See [ARCHITECTURE.md](ARCHITECTURE.md) for boundaries, terminology and roadmap.

## Security boundary

- No signing occurs in the browser.
- No secret is required to run demo mode.
- No wallet or token transaction is implemented.
- No exact installation coordinate is included.
- No HTTP success response is described as cryptographic verification.
- No local append-only ledger is described as a public blockchain.

Report security concerns through the contact channel published by the project owner. Do not include secrets or sensitive operational evidence in a public issue.

## License and intellectual property

No open-source license has been granted by this repository. Copyright © 2026 Gabriel de Almeida Santos Silva. All rights reserved.

