export type RuntimeMode = 'demo' | 'connected' | 'partial';

export type ServiceState = 'online' | 'degraded' | 'offline' | 'simulated';

export interface ServiceHealth {
  id: string;
  label: string;
  description: string;
  state: ServiceState;
  detail: string;
}

export interface PhysicalEvent {
  event_type: 'weight_measurement';
  timestamp: string;
  device: {
    scale: string;
    interface: string;
    identity: string;
  };
  measurement: {
    weight_kg: number;
    tare_kg: number;
  };
  location: {
    label: string;
    disclosure: string;
    source: string;
  };
  source: 'physical_scale' | 'demo_fixture';
  integrity: {
    algorithm: 'SHA-256';
    hash: string;
  };
}

export interface AuditSummary {
  blockCount: number | null;
  merkleRoot: string | null;
  anchoring: 'local-evidence' | 'not-connected' | 'unknown';
  lastUpdate: string;
}

export interface LabSnapshot {
  mode: RuntimeMode;
  generatedAt: string;
  notice: string;
  services: ServiceHealth[];
  latestEvent: PhysicalEvent;
  audit: AuditSummary;
}

export type CapabilityStatus = 'implemented' | 'experimental' | 'roadmap';

export interface Capability {
  capability: string;
  status: CapabilityStatus;
  evidence: string;
}

