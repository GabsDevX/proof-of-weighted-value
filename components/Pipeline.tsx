const stages = [
  {
    index: '01',
    title: 'Physical event',
    description: 'A scale or sensor produces the measurement at the installation.',
  },
  {
    index: '02',
    title: 'Host bridge',
    description: 'Serial bytes are parsed and normalized into a structured event.',
  },
  {
    index: '03',
    title: 'Compact proof',
    description: 'The PoWV-SBD profile binds identity, event data and integrity material.',
  },
  {
    index: '04',
    title: 'Edge validation',
    description: 'The gateway checks format, signature and replay before acceptance.',
  },
  {
    index: '05',
    title: 'Audit chain',
    description: 'Accepted event hashes update the local audit state and Merkle root.',
  },
  {
    index: '06',
    title: 'Evidence',
    description: 'A signed append-only record supports later verification and review.',
  },
];

export function Pipeline() {
  return (
    <div className="pipeline" aria-label="Physical-to-digital validation pipeline">
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

