import type { MatrixRow } from "../__types";

type MatrixTableProps = {
  title: string;
  subtitle: string;
  headers: string[];
  rows: MatrixRow[];
};

const Table = ({ title, subtitle, headers, rows }: MatrixTableProps) => {
  // hitung total per kolom header
  const totalsByHeader = headers.reduce<Record<string, number>>((acc, h) => {
    acc[h] = rows.reduce((sum, r) => sum + (r.counts?.[h] ?? 0), 0);
    return acc;
  }, {});

  const grandTotal = rows.reduce((sum, r) => sum + (r.total ?? 0), 0);

  return (
    <div className="h-full touch-pan-x touch-pan-y rounded-lg border border-gray-300 bg-white p-3 shadow">
      <div className="space-y-1">
        <h2 className="font-semibold">{title}</h2>
        <p className="text-sm text-gray-400">{subtitle}</p>
      </div>

      <div className="max-h-96 overflow-auto">
        <table className="w-full border-collapse">
          <thead className="whitespace-nowrap">
            <tr className="border-b border-gray-400">
              <th className="sticky top-0 z-30 w-16 bg-white p-2 text-left">
                No.
              </th>

              <th className="sticky top-0 left-0 z-40 bg-white p-2 text-left">
                <div className="min-w-40">Nama UPTD</div>
              </th>

              <th className="sticky top-0 z-30 bg-white p-2 text-center">
                Total
              </th>

              {headers.map((h) => (
                <th
                  key={h}
                  className="sticky top-0 z-30 bg-white p-2 text-center"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, idx) => (
              <tr key={row.uptd_id} className="border-b">
                <td className="p-2">{idx + 1}</td>

                <td className="sticky left-0 z-20 bg-white p-2 whitespace-nowrap">
                  {row.uptd_nama}
                </td>

                <td className="p-2 text-center">{row.total}</td>

                {headers.map((h) => (
                  <td key={h} className="p-2 text-center">
                    {row.counts?.[h] ?? 0}
                  </td>
                ))}
              </tr>
            ))}

            {!rows.length && (
              <tr>
                <td
                  colSpan={headers.length + 3}
                  className="p-4 text-center text-sm text-gray-400"
                >
                  Tidak ada data
                </td>
              </tr>
            )}
          </tbody>

          {/* Sticky footer TOTAL */}
          <tfoot className="whitespace-nowrap">
            <tr className="border-t border-gray-400 font-semibold">
              <td className="sticky bottom-0 z-30 bg-white p-2" />

              <td className="sticky bottom-0 left-0 z-40 bg-white p-2">
                TOTAL
              </td>

              <td className="sticky bottom-0 z-30 bg-white p-2 text-center">
                {grandTotal}
              </td>

              {headers.map((h) => (
                <td
                  key={h}
                  className="sticky bottom-0 z-30 bg-white p-2 text-center"
                >
                  {totalsByHeader[h] ?? 0}
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default Table;
