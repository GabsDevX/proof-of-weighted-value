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
      setError(cause instanceof Error ? cause.message : 'Unable to load the laboratory snapshot.');
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
            <small>Verification console</small>
          </span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#pipeline">Pipeline</a>
          <a href="#evidence">Evidence</a>
          <a href="#status">Status</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero__content">
            <div className="hero__label">
              <span className="signal-dot" />
              Public reference interface
            </div>
            <h1>Physical events.<br /><span>Verifiable digital evidence.</span></h1>
            <p>
              A public observability console aligned with the PoWV Virtual Lab model:
              acquisition, normalization, cryptographic validation, replay protection and auditable evidence.
            </p>
            <div className="hero__actions">
              <a className="button button--primary" href="#pipeline">Explore the pipeline</a>
              <a className="button button--ghost" href="#status">Review implementation status</a>
            </div>
          </div>

          <aside className="hero__telemetry" aria-label="Console state">
            <div className="telemetry__header">
              <span>Runtime state</span>
              {snapshot && <StatusBadge state={snapshot.mode} />}
            </div>
            <div className="telemetry__metric">
              <span>Audit blocks</span>
              <strong>{snapshot?.audit.blockCount ?? '—'}</strong>
            </div>
            <div className="telemetry__metric">
              <span>Packet profile</span>
              <strong>132 B</strong>
            </div>
            <div className="telemetry__metric">
              <span>Signature profile</span>
              <strong>ECDSA P-256</strong>
            </div>
            <div className="telemetry__root">
              <span>Merkle root</span>
              <code>{snapshot?.audit.merkleRoot ?? 'Not connected'}</code>
            </div>
            <button className="button button--refresh" disabled={loading} onClick={() => void refresh()} type="button">
              {loading ? 'Refreshing…' : 'Refresh state'}
            </button>
          </aside>
        </section>

        {error && <div className="notice notice--error">{error}</div>}
        {snapshot && <div className="notice"><strong>{snapshot.mode === 'demo' ? 'Demo boundary:' : 'Runtime note:'}</strong> {snapshot.notice}</div>}

        <section className="section" id="status">
          <div className="section__heading">
            <div>
              <p className="eyebrow">System surface</p>
              <h2>Laboratory services</h2>
            </div>
            {snapshot && <span className="updated-at">Updated {shortTimestamp(snapshot.generatedAt)}</span>}
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
              <p className="eyebrow">Reference architecture</p>
              <h2>From measurement to evidence</h2>
              <p className="section__intro">
                Each stage has a distinct responsibility. Validation proves structural and cryptographic acceptance;
                interpretation and tokenization remain separate application layers.
              </p>
            </div>
          </div>
          <Pipeline />
        </section>

        {snapshot && (
          <section className="section evidence-layout" id="evidence">
            <EventCard event={snapshot.latestEvent} />

            <article className="panel contract-card">
              <p className="eyebrow">Evidence contract</p>
              <h2>What this interface can prove</h2>
              <ul className="check-list">
                <li><span>01</span> The event structure displayed by the public adapter.</li>
                <li><span>02</span> Reachability of explicitly configured laboratory services.</li>
                <li><span>03</span> The documented verification sequence and capability boundary.</li>
              </ul>
              <div className="boundary">
                <strong>It does not prove</strong>
                <p>A public-chain transaction, live GNSS position, industrial certification or token issuance.</p>
              </div>
            </article>
          </section>
        )}

        <section className="section" id="implementation">
          <div className="section__heading section__heading--narrow">
            <div>
              <p className="eyebrow">Delivery status</p>
              <h2>Implemented, experimental and next</h2>
              <p className="section__intro">
                The public console distinguishes working laboratory behavior from experimental integration and roadmap work.
              </p>
            </div>
          </div>
          <CapabilityMatrix />
        </section>

        <section className="section principle-grid">
          <article>
            <span>01</span>
            <h3>Identity before value</h3>
            <p>Device identity and event authenticity are evaluated before any business interpretation.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Evidence before tokenization</h3>
            <p>The public application no longer fabricates transaction hashes or implies a deployed token layer.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Explicit trust boundaries</h3>
            <p>Demo data, configured endpoints and implemented capabilities remain visibly separated.</p>
          </article>
        </section>
      </main>

      <footer>
        <div>
          <strong>PoWV Protocol</strong>
          <p>Public technical interface for physical-to-digital verification research.</p>
        </div>
        <span>Prototype · Not a production or investment system</span>
      </footer>
    </div>
  );
}

export default App;

