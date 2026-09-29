import type { Capability } from '../types';
import { StatusBadge } from './StatusBadge';

const capabilities: Capability[] = [
  {
    capability: 'PoWV-SBD binary envelope',
    status: 'implemented',
    evidence: 'Fixed-size packet construction with a canonical unsigned byte sequence.',
  },
  {
    capability: 'ECDSA P-256 verification',
    status: 'implemented',
    evidence: 'Verification is executed over the exact unsigned bytes received by the gateway.',
  },
  {
    capability: 'Replay control',
    status: 'implemented',
    evidence: 'Per-device event uniqueness with retry-safe in-flight reservation.',
  },
  {
    capability: 'Urano acquisition bridge',
    status: 'experimental',
    evidence: 'Host-mediated serial acquisition with configurable HTTP delivery to an ESP32 endpoint.',
  },
  {
    capability: 'MQTT/TLS and RS-485 transports',
    status: 'roadmap',
    evidence: 'Transport profiles and failure semantics are not implemented in the public reference.',
  },
  {
    capability: 'External-ledger anchoring',
    status: 'roadmap',
    evidence: 'No independently verifiable public-ledger receipt is produced by the current system.',
  },
];

export function CapabilityMatrix() {
  return (
    <div className="capability-list">
      {capabilities.map((item) => (
        <article className="capability" key={item.capability}>
          <div>
            <h3>{item.capability}</h3>
            <p>{item.evidence}</p>
          </div>
          <StatusBadge state={item.status} />
        </article>
      ))}
    </div>
  );
}

