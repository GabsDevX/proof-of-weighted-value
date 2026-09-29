# Security Policy

## Supported version

Security corrections apply to the current `main` branch. Historical commits are retained for traceability and are not maintained as deployable releases.

## Security model

The public application is an untrusted browser client. It may consume explicitly exposed read-only status data. It must not perform or receive authority for:

- event signing;
- device registration or key rotation;
- administrative audit operations;
- unrestricted evidence retrieval;
- ledger submission;
- token issuance, transfer or retirement.

Cryptographic acceptance and replay decisions belong to the edge gateway. Audit-state integrity belongs to the audit service and evidence layer.

## Deployment requirements

- Treat every `VITE_*` value as public because Vite embeds it in the production bundle.
- Expose only endpoints designed for unauthenticated read-only access.
- Apply an explicit origin allowlist; do not use unrestricted CORS for operational services.
- Terminate TLS before exposing status endpoints outside a loopback or isolated laboratory network.
- Do not return public keys, raw packets, signatures, precise coordinates or operational identifiers from browser-facing health routes unless the disclosure is intentional and reviewed.
- Apply request timeouts, response-size limits and schema validation at the public adapter boundary.

## Evidence limitations

The client does not establish physical-source accuracy, cryptographic validity, external-ledger inclusion or industrial certification. A health response confirms endpoint reachability only. A local Merkle root is not a public-chain receipt.

## Vulnerability reporting

Do not create a public issue containing credentials, private endpoints, exact installation coordinates, device keys, raw operational evidence or exploit details affecting a reachable system.

Report security concerns privately to `gabriel@powvprotocol.org` and include:

- affected component and revision;
- reproduction preconditions;
- observed and expected behavior;
- potential impact;
- proposed mitigation, if available.

Revoke or rotate any credential before reporting accidental disclosure. Do not transmit active secrets in the report.

