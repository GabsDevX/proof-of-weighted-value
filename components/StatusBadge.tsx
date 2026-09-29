import type { RuntimeMode, ServiceState } from '../types';

type BadgeState = RuntimeMode | ServiceState | 'implemented' | 'experimental' | 'roadmap';

const labels: Record<BadgeState, string> = {
  connected: 'Connected',
  partial: 'Partial',
  demo: 'Fixture',
  online: 'Reachable',
  degraded: 'Degraded',
  offline: 'Unavailable',
  simulated: 'Fixture',
  implemented: 'Lab-validated',
  experimental: 'Experimental',
  roadmap: 'Planned',
};

export function StatusBadge({ state }: { state: BadgeState }) {
  return (
    <span className={`badge badge--${state}`} data-state={state}>
      {labels[state]}
    </span>
  );
}
