import type { LabSnapshot, PhysicalEvent, ServiceHealth } from '../types';

const gatewayUrl = import.meta.env.VITE_POWV_GATEWAY_URL?.trim();
const auditUrl = import.meta.env.VITE_POWV_AUDIT_URL?.trim();

// Deterministic synthetic fixture. The integrity hash is SHA-256 over the
// canonical JSON body (sorted keys, compact separators) before "integrity".
const demoEvent: PhysicalEvent = {
  event_type: 'weight_measurement',
  timestamp: '2026-01-01T12:00:00-03:00',
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
    disclosure: 'Exact coordinates withheld',
    source: 'configured_metadata',
  },
  source: 'demo_fixture',
  integrity: {
    algorithm: 'SHA-256',
    hash: '63798e589081f9bc2b65e57a336217950f3d3c2c07e46d4e1d492dcdb29b71a1',
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
    notice: 'Deterministic synthetic fixture. No operational measurement, signature result or ledger inclusion is represented.',
    services: [
      service('physical', 'Physical source', 'Instrument acquisition and normalization', 'simulated', 'Deterministic Urano-compatible fixture'),
      service('gateway', 'Edge gateway', 'Structure, signature and replay verification', 'simulated', 'Validation endpoint not queried'),
      service('audit', 'Audit service', 'Event registry and Merkle-root calculation', 'simulated', 'Audit endpoint not queried'),
      service('anchor', 'Evidence anchor', 'Append-only evidence retention', 'simulated', 'No external anchor adapter configured'),
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
  return url.replace(/\/+$/, '');
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

    const payload: unknown = await response.json();
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      throw new Error('Expected a JSON object');
    }

    return payload as Record<string, unknown>;
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
      ? 'Configured health endpoints returned successful JSON responses. The event record remains a synthetic fixture.'
      : 'At least one configured endpoint is unavailable. Service state reflects individual request outcomes; the event record remains a synthetic fixture.',
    services: [
      service('physical', 'Physical source', 'Instrument acquisition and normalization', 'simulated', 'No browser-facing acquisition endpoint configured'),
      service(
        'gateway',
        'Edge gateway',
        'Structure, signature and replay verification',
        gatewayOnline ? 'online' : gatewayUrl ? 'offline' : 'simulated',
        gatewayOnline ? 'GET / returned 2xx JSON' : gatewayUrl ? 'Configured request failed' : 'Endpoint not configured',
      ),
      service(
        'audit',
        'Audit service',
        'Event registry and Merkle-root calculation',
        auditOnline ? 'online' : auditUrl ? 'offline' : 'simulated',
        auditOnline ? 'GET / returned 2xx JSON' : auditUrl ? 'Configured request failed' : 'Endpoint not configured',
      ),
      service('anchor', 'Evidence anchor', 'Append-only evidence retention', 'simulated', 'No public anchor adapter configured'),
    ],
    audit: {
      blockCount,
      merkleRoot,
      anchoring: auditOnline ? 'unknown' : 'not-connected',
      lastUpdate: new Date().toISOString(),
    },
  };
}
