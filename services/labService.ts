import type { LabSnapshot, PhysicalEvent, ServiceHealth } from '../types';

const gatewayUrl = import.meta.env.VITE_POWV_GATEWAY_URL?.trim();
const auditUrl = import.meta.env.VITE_POWV_AUDIT_URL?.trim();

const demoEvent: PhysicalEvent = {
  event_type: 'weight_measurement',
  timestamp: '2026-09-28T22:39:29-03:00',
  device: {
    scale: 'Urano US POP',
    interface: 'serial bridge',
    identity: 'public-demo-device',
  },
  measurement: {
    weight_kg: 12.48,
    tare_kg: 0,
  },
  location: {
    label: 'Provisioned installation',
    disclosure: 'Exact coordinates withheld from the public demo',
    source: 'configured_metadata',
  },
  source: 'demo_fixture',
  integrity: {
    algorithm: 'SHA-256',
    hash: '4df0678f51a94243fe3781ddf5ac68903a28ca956ae66110f65079280e64382c',
  },
};

function service(
  id: string,
  label: string,
  description: string,
  state: ServiceHealth['state'],
  detail: string,
): ServiceHealth {
  return { id, label, description, state, detail };
}

function demoSnapshot(): LabSnapshot {
  return {
    mode: 'demo',
    generatedAt: new Date().toISOString(),
    notice: 'Public demonstration data. No transaction, signature or anchoring claim is produced by this interface.',
    services: [
      service('physical', 'Physical source', 'Scale acquisition and normalization', 'simulated', 'Urano lab fixture'),
      service('gateway', 'Edge gateway', 'Packet validation and replay protection', 'simulated', 'PoWV-SBD contract'),
      service('audit', 'Audit chain', 'Event registry and Merkle root', 'simulated', 'Local laboratory model'),
      service('anchor', 'Evidence anchor', 'Append-only evidence record', 'simulated', 'Local signed evidence'),
    ],
    latestEvent: demoEvent,
    audit: {
      blockCount: 24,
      merkleRoot: '9a4c4b31c45d8e73…6d7dcb57cbd2f710',
      anchoring: 'not-connected',
      lastUpdate: new Date().toISOString(),
    },
  };
}

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/$/, '');
}

async function fetchJson(url: string, timeoutMs = 3500): Promise<Record<string, unknown>> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json() as Record<string, unknown>;
  } finally {
    window.clearTimeout(timeout);
  }
}

function compactHash(value: unknown): string | null {
  if (typeof value !== 'string' || value.length === 0) return null;
  if (value.length <= 32) return value;
  return `${value.slice(0, 16)}…${value.slice(-16)}`;
}

export async function loadLabSnapshot(): Promise<LabSnapshot> {
  if (!gatewayUrl && !auditUrl) return demoSnapshot();

  const fallback = demoSnapshot();
  const gatewayBase = gatewayUrl ? normalizeBaseUrl(gatewayUrl) : null;
  const auditBase = auditUrl ? normalizeBaseUrl(auditUrl) : null;

  const [gatewayResult, auditResult, merkleResult] = await Promise.allSettled([
    gatewayBase ? fetchJson(`${gatewayBase}/`) : Promise.reject(new Error('not configured')),
    auditBase ? fetchJson(`${auditBase}/`) : Promise.reject(new Error('not configured')),
    auditBase ? fetchJson(`${auditBase}/merkle_root`) : Promise.reject(new Error('not configured')),
  ]);

  const gatewayOnline = gatewayResult.status === 'fulfilled';
  const auditOnline = auditResult.status === 'fulfilled';
  const merklePayload = merkleResult.status === 'fulfilled' ? merkleResult.value : {};
  const auditPayload = auditResult.status === 'fulfilled' ? auditResult.value : {};

  const blockCountValue = auditPayload.blocks ?? auditPayload.block_count ?? merklePayload.blocks;
  const blockCount = typeof blockCountValue === 'number' ? blockCountValue : null;
  const merkleRoot = compactHash(merklePayload.merkle_root ?? merklePayload.root);

  return {
    ...fallback,
    mode: gatewayOnline && auditOnline ? 'connected' : 'partial',
    generatedAt: new Date().toISOString(),
    notice: gatewayOnline && auditOnline
      ? 'Connected to configured laboratory endpoints. The browser displays service state; it does not hold signing keys.'
      : 'Partial connection. Unavailable services are shown explicitly and demonstration data remains visually identified.',
    services: [
      service('physical', 'Physical source', 'Scale acquisition and normalization', 'simulated', 'Not queried by the public browser'),
      service(
        'gateway',
        'Edge gateway',
        'Packet validation and replay protection',
        gatewayOnline ? 'online' : gatewayUrl ? 'offline' : 'simulated',
        gatewayOnline ? 'Health endpoint reachable' : gatewayUrl ? 'Configured endpoint unavailable' : 'Endpoint not configured',
      ),
      service(
        'audit',
        'Audit chain',
        'Event registry and Merkle root',
        auditOnline ? 'online' : auditUrl ? 'offline' : 'simulated',
        auditOnline ? 'Health endpoint reachable' : auditUrl ? 'Configured endpoint unavailable' : 'Endpoint not configured',
      ),
      service('anchor', 'Evidence anchor', 'Append-only evidence record', 'simulated', 'Not exposed by the public adapter'),
    ],
    audit: {
      blockCount,
      merkleRoot,
      anchoring: auditOnline ? 'unknown' : 'not-connected',
      lastUpdate: new Date().toISOString(),
    },
  };
}

