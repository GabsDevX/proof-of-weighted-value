import { useState } from 'react';
import type { PhysicalEvent } from '../types';

function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(value);
}

export function EventCard({ event }: { event: PhysicalEvent }) {
  const [showRaw, setShowRaw] = useState(false);

  return (
    <article className="panel event-card">
      <div className="panel__header">
        <div>
          <p className="eyebrow">Normalized event</p>
          <h2>Measurement record</h2>
        </div>
        <button className="button button--ghost" onClick={() => setShowRaw((value) => !value)} type="button">
          {showRaw ? 'Hide JSON' : 'Inspect JSON'}
        </button>
      </div>

      <div className="measurement">
        <strong>{formatNumber(event.measurement.weight_kg)}</strong>
        <span>kg</span>
      </div>

      <dl className="detail-grid">
        <div>
          <dt>Instrument</dt>
          <dd>{event.device.scale}</dd>
        </div>
        <div>
          <dt>Acquisition interface</dt>
          <dd>{event.device.interface}</dd>
        </div>
        <div>
          <dt>Event timestamp</dt>
          <dd>{event.timestamp}</dd>
        </div>
        <div>
          <dt>Location policy</dt>
          <dd>{event.location.disclosure}</dd>
        </div>
      </dl>

      <div className="hash-block">
        <span>Canonical event SHA-256</span>
        <code>{event.integrity.hash}</code>
      </div>

      {showRaw && <pre className="json-view">{JSON.stringify(event, null, 2)}</pre>}
    </article>
  );
}

