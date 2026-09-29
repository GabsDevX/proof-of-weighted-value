# Security policy

## Supported version

Security fixes are applied to the latest version on the `main` branch. Historical demonstration commits are not maintained as deployable releases.

## Reporting a vulnerability

Do not open a public issue containing credentials, private endpoints, precise installation coordinates, device keys, raw operational evidence or instructions that would expose a live system.

Report security concerns privately to `gabriel@powvprotocol.org` with:

- affected file or component;
- reproduction conditions;
- potential impact;
- suggested mitigation, when available.

Do not include working secrets. Revoke or rotate any credential before reporting accidental exposure.

## Public-console boundary

This repository is a public frontend prototype. It must not be trusted to:

- hold signing keys;
- authorize devices;
- submit administrative requests;
- prove a physical measurement independently;
- issue, transfer or retire tokens;
- certify publication to a public blockchain.

The browser may read deliberately exposed laboratory health information. All cryptographic acceptance and replay decisions belong to the edge and audit services.

