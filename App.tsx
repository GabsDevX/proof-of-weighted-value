import { useCallback, useEffect, useState } from 'react';
import { CapabilityMatrix } from './components/CapabilityMatrix';
import { EventCard } from './components/EventCard';
import { Pipeline } from './components/Pipeline';
import { StatusBadge } from './components/StatusBadge';
import { loadLabSnapshot } from './services/labService';
import type { LabSnapshot } from './types';

function shortTimestamp(value: string): string {
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function App() {
  const [snapshot, setSnapshot] = useState<LabSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setSnapshot(await loadLabSnapshot());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to load the runtime snapshot.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="PoWV Protocol home">
          <span className="brand__mark">P</span>
          <span>
            <strong>PoWV Protocol</strong>
            <small>Verification reference</small>
          </span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#pipeline">Architecture</a>
          <a href="#evidence">Event record</a>
          <a href="#status">System status</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero__content">
            <div className="hero__label">
              <span className="signal-dot" />
              Experimental reference implementation
            </div>
            <h1>Physical-to-digital<br /><span>verification pipeline.</span></h1>
            <p>
              Observability interface for the PoWV laboratory architecture, covering acquisition,
              canonical event encoding, cryptographic verification, replay control and audit-state reporting.
            </p>
            <div className="hero__actions">
              <a className="button button--primary" href="#pipeline">View processing stages</a>
              <a className="button button--ghost" href="#status">View service status</a>
            </div>
          </div>

          <aside className="hero__telemetry" aria-label="Runtime summary">
            <div className="telemetry__header">
              <span>Runtime profile</span>
              {snapshot && <StatusBadge state={snapshot.mode} />}
            </div>
            <div className="telemetry__metric">
              <span>Audit record count</span>
              <strong>{snapshot?.audit.blockCount ?? '—'}</strong>
            </div>
            <div className="telemetry__metric">
              <span>Binary profile</span>
              <strong>132 B</strong>
            </div>
            <div className="telemetry__metric">
              <span>Signature scheme</span>
              <strong>ECDSA P-256</strong>
            </div>
            <div className="telemetry__root">
              <span>Reported Merkle root</span>
              <code>{snapshot?.audit.merkleRoot ?? 'Unavailable'}</code>
            </div>
            <button className="button button--refresh" disabled={loading} onClick={() => void refresh()} type="button">
              {loading ? 'Refreshing…' : 'Refresh status'}
            </button>
          </aside>
        </section>

        {error && <div className="notice notice--error">{error}</div>}
        {snapshot && (
          <div className="notice">
            <strong>{snapshot.mode === 'demo' ? 'Fixture profile:' : 'Runtime status:'}</strong> {snapshot.notice}
          </div>
        )}

        <section className="section" id="status">
          <div className="section__heading">
            <div>
              <p className="eyebrow">Runtime observability</p>
              <h2>Service status</h2>
            </div>
            {snapshot && <span className="updated-at">Observed {shortTimestamp(snapshot.generatedAt)}</span>}
          </div>

          <div className="service-grid">
            {snapshot?.services.map((item) => (
              <article className="service-card" key={item.id}>
                <div className="service-card__top">
                  <span className="service-card__icon">{item.id.slice(0, 2).toUpperCase()}</span>
                  <StatusBadge state={item.state} />
                </div>
                <h3>{item.label}</h3>
                <p>{item.description}</p>
                <small>{item.detail}</small>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="pipeline">
          <div className="section__heading section__heading--narrow">
            <div>
              <p className="eyebrow">Processing model</p>
              <h2>Verification stages</h2>
              <p className="section__intro">
                The architecture separates acquisition, cryptographic acceptance, audit persistence and downstream
                business interpretation. Each stage has an explicit control boundary.
              </p>
            </div>
          </div>
          <Pipeline />
        </section>

        {snapshot && (
          <section className="section evidence-layout" id="evidence">
            <EventCard event={snapshot.latestEvent} />

            <article className="panel contract-card">
              <p className="eyebrow">Evidence semantics</p>
              <h2>Exposed verification state</h2>
              <ul className="check-list">
                <li><span>01</span> Normalized event fields and the declared SHA-256 identifier.</li>
                <li><span>02</span> Reachability state for explicitly configured read-only endpoints.</li>
                <li><span>03</span> Audit record count and Merkle root reported by the audit service.</li>
              </ul>
              <div className="boundary">
                <strong>Excluded assertions</strong>
                <p>Physical accuracy, live GNSS attestation, public-ledger inclusion, industrial certification and token issuance.</p>
              </div>
            </article>
          </section>
        )}

        <section className="section" id="implementation">
          <div className="section__heading section__heading--narrow">
            <div>
              <p className="eyebrow">Implementation status</p>
              <h2>Capability maturity</h2>
              <p className="section__intro">
                Status values distinguish laboratory-validated controls, experimental hardware integration and planned transport or settlement work.
              </p>
            </div>
          </div>
          <CapabilityMatrix />
        </section>

        <section className="section principle-grid" aria-label="Architecture constraints">
          <article>
            <span>01</span>
            <h3>Verification authority</h3>
            <p>Device identity and signature acceptance are evaluated by the edge gateway, not by the browser client.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Replay control</h3>
            <p>Event uniqueness is enforced per device across committed and concurrent in-flight state.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Ledger scope</h3>
            <p>The reported Merkle root represents local audit state unless an independent external anchor receipt is available.</p>
          </article>
        </section>
      </main>

      <footer>
        <div>
          <strong>PoWV Protocol</strong>
          <p>Reference implementation for physical-to-digital event verification.</p>
        </div>
        <span>Experimental software · Not production-qualified</span>
      </footer>
    </div>
  );
}

export default App;

