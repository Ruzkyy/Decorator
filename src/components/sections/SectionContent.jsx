// Vista: renderiza el contenido textual de cada sección según su tipo.
export default function SectionContent({ section }) {
  const type = section.type;

  if (type === "prosCons") {
    return (
      <div className="pros-cons">
        <div>
          <h3>Ventajas:</h3>
          <ul>
            {section.advantages.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
        <div>
          <h3>Desventajas:</h3>
          <ul>
            {section.disadvantages.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </div>
    );
  }

  if (type === "patterns") {
    return (
      <div className="pros-cons pattern-groups">
        {section.patternGroups.map((group) => (
          <div key={group.title}>
            <h3>{group.title}</h3>
            <ul>
              {group.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        ))}
      </div>
    );
  }

  return <p>{section.content}</p>;
}
