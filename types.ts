export type RuntimeMode = 'demo' | 'connected' | 'partial';

export type ServiceState = 'online' | 'degraded' | 'offline' | 'simulated';

export interface ServiceHealth {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly state: ServiceState;
  readonly detail: string;
}

export interface PhysicalEvent {
  readonly event_type: 'weight_measurement';
  readonly timestamp: string;
  readonly device: {
    readonly scale: string;
    readonly interface: string;
    readonly identity: string;
  };
  readonly measurement: {
    readonly weight_kg: number;
    readonly tare_kg: number;
  };
  readonly location: {
    readonly label: string;
    readonly disclosure: string;
    readonly source: string;
  };
  readonly source: 'physical_scale' | 'demo_fixture';
  readonly integrity: {
    readonly algorithm: 'SHA-256';
    readonly hash: string;
  };
}

export interface AuditSummary {
  readonly blockCount: number | null;
  readonly merkleRoot: string | null;
  readonly anchoring: 'local-evidence' | 'not-connected' | 'unknown';
  readonly lastUpdate: string;
}

export interface LabSnapshot {
  readonly mode: RuntimeMode;
  readonly generatedAt: string;
  readonly notice: string;
  readonly services: readonly ServiceHealth[];
  readonly latestEvent: PhysicalEvent;
  readonly audit: AuditSummary;
}

export type CapabilityStatus = 'implemented' | 'experimental' | 'roadmap';

export interface Capability {
  readonly capability: string;
  readonly status: CapabilityStatus;
  readonly evidence: string;
}
