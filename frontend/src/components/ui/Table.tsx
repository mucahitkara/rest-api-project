type Column = {
  key: string;
  label: string;
};

type TableProps = {
  columns: Column[];
  data: Record<string, React.ReactNode>[];
};

export default function Table({ columns, data }: TableProps) {
  if (data.length === 0) {
    return (
      <div className="w-full rounded-lg border border-neutral-200 px-4 py-8 text-center text-neutral-500 text-sm">
        No data available
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-neutral-200">
      <table className="w-full text-sm">
        <thead className="bg-neutral-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="hover:bg-neutral-50 even:bg-neutral-50/50">
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="px-4 py-3 text-neutral-800 border-t border-neutral-200"
                >
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
