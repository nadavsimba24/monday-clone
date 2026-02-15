import { STATUS_OPTIONS, PRIORITY_OPTIONS } from '../../data/defaultData';

export default function SummaryRow({ items, columns, groupColor }) {
  function getSummary(column) {
    const vals = items.map((i) => i.values[column.id]).filter(Boolean);
    if (!vals.length) return null;

    switch (column.type) {
      case 'numbers': {
        const nums = vals.filter((v) => typeof v === 'number');
        if (!nums.length) return null;
        const sum = nums.reduce((a, b) => a + b, 0);
        return <span className="summary-number">{sum}</span>;
      }
      case 'status': {
        const counts = {};
        vals.forEach((v) => { counts[v] = (counts[v] || 0) + 1; });
        const total = vals.length;
        return (
          <div className="summary-bar">
            {Object.entries(counts).map(([label, count]) => {
              const opt = STATUS_OPTIONS.find((o) => o.label === label);
              return (
                <div
                  key={label}
                  className="summary-segment"
                  style={{
                    width: `${(count / total) * 100}%`,
                    backgroundColor: opt?.color || '#c4c4c4',
                  }}
                  title={`${label}: ${count}`}
                />
              );
            })}
          </div>
        );
      }
      case 'priority': {
        const counts = {};
        vals.forEach((v) => { counts[v] = (counts[v] || 0) + 1; });
        const total = vals.length;
        return (
          <div className="summary-bar">
            {Object.entries(counts).map(([label, count]) => {
              const opt = PRIORITY_OPTIONS.find((o) => o.label === label);
              return (
                <div
                  key={label}
                  className="summary-segment"
                  style={{
                    width: `${(count / total) * 100}%`,
                    backgroundColor: opt?.color || '#c4c4c4',
                  }}
                  title={`${label}: ${count}`}
                />
              );
            })}
          </div>
        );
      }
      default:
        return null;
    }
  }

  return (
    <div className="summary-row">
      <div className="group-color-bar" style={{ backgroundColor: groupColor, opacity: 0.3 }} />
      <div className="summary-count">{items.length} item{items.length !== 1 ? 's' : ''}</div>
      {columns.map((col) => (
        <div key={col.id} className="summary-cell" style={{ width: col.width, minWidth: col.width }}>
          {getSummary(col)}
        </div>
      ))}
    </div>
  );
}
