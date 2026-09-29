const stages = [
  {
    index: '01',
    title: 'Physical acquisition',
    description: 'The instrument interface produces the source measurement response.',
  },
  {
    index: '02',
    title: 'Event normalization',
    description: 'The host bridge parses the serial response and constructs the normalized event.',
  },
  {
    index: '03',
    title: 'Canonical encoding',
    description: 'PoWV-SBD serializes the unsigned fields and device signature into a fixed-size packet.',
  },
  {
    index: '04',
    title: 'Edge verification',
    description: 'The gateway validates structure, device identity, signature and replay state.',
  },
  {
    index: '05',
    title: 'Audit ingestion',
    description: 'The accepted event identifier is appended and the audit Merkle root is recalculated.',
  },
  {
    index: '06',
    title: 'Evidence output',
    description: 'Append-only evidence supports subsequent integrity and control review.',
  },
];

export function Pipeline() {
  return (
    <div className="pipeline" aria-label="Physical-to-digital verification stages">
      {stages.map((stage) => (
        <article className="pipeline__stage" key={stage.index}>
          <span className="pipeline__index">{stage.index}</span>
          <div>
            <h3>{stage.title}</h3>
            <p>{stage.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

