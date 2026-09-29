import type { RuntimeMode, ServiceState } from '../types';

type BadgeState = RuntimeMode | ServiceState | 'implemented' | 'experimental' | 'roadmap';

const labels: Record<BadgeState, string> = {
  connected: 'Connected',
  partial: 'Partial',
  demo: 'Demo mode',
  online: 'Online',
  degraded: 'Degraded',
  offline: 'Offline',
  simulated: 'Demonstration',
  implemented: 'Implemented',
  experimental: 'Experimental',
  roadmap: 'Roadmap',
};

export function StatusBadge({ state }: { state: BadgeState }) {
  return <span className={`badge badge--${state}`}>{labels[state]}</span>;
}

