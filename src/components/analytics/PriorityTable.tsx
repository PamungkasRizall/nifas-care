import React from "react";

interface PriorityColumn {
  key: string;
  header: string;
  render?: (row: any) => React.ReactNode;
  alignClass?: string; // e.g. "text-center" or "text-right"
}

interface PriorityTableProps {
  title: string;
  columns: PriorityColumn[];
  rows: any[];
  emptyMessage?: string;
}

export default function PriorityTable({
  title,
  columns,
  rows,
  emptyMessage = "Tidak ada tugas prioritas saat ini.",
}: PriorityTableProps) {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm space-y-4 p-5">
      <h3 className="font-bold text-foreground text-sm uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>

      {rows.length === 0 ? (
        <div className="py-8 text-center text-xs text-muted-foreground italic">
          {emptyMessage}
        </div>
      ) : (
        <div className="overflow-x-auto border border-border rounded-xl">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-border bg-muted/40 font-bold text-muted-foreground uppercase text-[10px] tracking-wider">
                {columns.map((col) => (
                  <th key={col.key} className={`px-4 py-3 ${col.alignClass || ""}`}>
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((row, rowIdx) => (
                <tr key={row.id || rowIdx} className="hover:bg-muted/10 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className={`px-4 py-3.5 font-medium ${col.alignClass || ""}`}>
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
