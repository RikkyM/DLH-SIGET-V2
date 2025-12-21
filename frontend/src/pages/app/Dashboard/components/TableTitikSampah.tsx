import { Fragment, useMemo } from "react";

type TpsCount = { jumlah: number; volume: number };

type Row = {
  uptd_id: number;
  uptd_nama: string;
  total_tps: number;
  counts: Record<string, TpsCount>;

  // tambahan dari backend
  total_volume_1: number; // exclude "Titik Sampah Liar" (berdasarkan jumlah)
  total_volume_2: number; // include semua (berdasarkan jumlah)
};

type Props = {
  title: string;
  subtitle: string;
  headers: string[];
  rows: Row[];
};

export default function TableTpsTwoLevel({
  title,
  subtitle,
  headers,
  rows,
}: Props) {
  // TOTAL per header untuk footer
  const totalsByHeader = useMemo(() => {
    return headers.reduce<Record<string, { jumlah: number; volume: number }>>(
      (acc, h) => {
        const jumlah = rows.reduce(
          (sum, r) => sum + (r.counts?.[h]?.jumlah ?? 0),
          0,
        );
        const volume = rows.reduce(
          (sum, r) => sum + (r.counts?.[h]?.volume ?? 0),
          0,
        );
        acc[h] = { jumlah, volume };
        return acc;
      },
      {},
    );
  }, [headers, rows]);

  const grandTotalTps = useMemo(
    () => rows.reduce((sum, r) => sum + (r.total_tps ?? 0), 0),
    [rows],
  );

  const grandTotalVolume1 = useMemo(
    () => rows.reduce((sum, r) => sum + (r.total_volume_1 ?? 0), 0),
    [rows],
  );

  const grandTotalVolume2 = useMemo(
    () => rows.reduce((sum, r) => sum + (r.total_volume_2 ?? 0), 0),
    [rows],
  );

  return (
    <div className="h-full rounded-lg border border-gray-300 bg-white p-3 shadow">
      <div className="space-y-1">
        <h2 className="font-semibold">{title}</h2>
        <p className="text-sm text-gray-400">{subtitle}</p>
      </div>

      <div className="max-h-96 overflow-auto">
        <table className="w-full border-collapse">
          <thead className="whitespace-nowrap">
            <tr className="border-b border-gray-400">
              <th
                className="sticky top-0 z-40 bg-white p-2 text-left"
                rowSpan={2}
              >
                No.
              </th>

              <th
                className="sticky top-0 left-0 z-50 bg-white p-2 text-left"
                rowSpan={2}
              >
                <div className="min-w-40">Nama UPTD</div>
              </th>

              <th
                className="sticky top-0 z-40 bg-white p-2 text-center"
                rowSpan={2}
              >
                Total TPS
              </th>

              {headers.map((h) => (
                <th
                  key={h}
                  className="sticky top-0 z-40 bg-white p-2 text-center"
                  colSpan={2}
                >
                  {h}
                </th>
              ))}

              <th
                className="sticky top-0 z-40 bg-white p-2 text-center"
                rowSpan={2}
              >
                Total Volume Sampah 1
              </th>
              <th
                className="sticky top-0 z-40 bg-white p-2 text-center"
                rowSpan={2}
              >
                Total Volume Sampah 2
              </th>
            </tr>

            <tr className="border-b border-gray-400">
              {headers.map((h) => (
                <Fragment key={h}>
                  <th className="sticky top-10 z-40 bg-white p-2 text-center">
                    Jumlah
                  </th>
                  <th className="sticky top-10 z-40 bg-white p-2 text-center">
                    Volume
                  </th>
                </Fragment>
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

                <td className="p-2 text-center">{row.total_tps ?? 0}</td>

                {headers.map((h) => (
                  <Fragment key={h}>
                    <td className="p-2 text-center">
                      {row.counts?.[h]?.jumlah ?? 0}
                    </td>
                    <td className="p-2 text-center">
                      {row.counts?.[h]?.volume ? `${row.counts?.[h]?.volume} KG` : 0}
                    </td>
                  </Fragment>
                ))}

                <td className="p-2 text-center">{row.total_volume_1 ? `${row.total_volume_1} KG` : 0}</td>
                <td className="p-2 text-center">{row.total_volume_2 ? `${row.total_volume_2} KG` : 0}</td>
              </tr>
            ))}

            {!rows.length && (
              <tr>
                <td
                  colSpan={3 + headers.length * 2 + 2}
                  className="p-4 text-center text-sm text-gray-400"
                >
                  Tidak ada data
                </td>
              </tr>
            )}
          </tbody>

          <tfoot className="whitespace-nowrap">
            <tr className="border-t border-gray-400 font-semibold">
              <td className="sticky bottom-0 z-40 bg-white p-2" />

              <td className="sticky bottom-0 left-0 z-50 bg-white p-2">
                TOTAL
              </td>

              <td className="sticky bottom-0 z-40 bg-white p-2 text-center">
                {grandTotalTps}
              </td>

              {headers.map((h) => (
                <Fragment key={h}>
                  <td className="sticky bottom-0 z-40 bg-white p-2 text-center">
                    {totalsByHeader[h]?.jumlah ?? 0}
                  </td>
                  <td className="sticky bottom-0 z-40 bg-white p-2 text-center">
                    {totalsByHeader[h]?.volume ? `${totalsByHeader[h]?.volume} KG` : 0}
                  </td>
                </Fragment>
              ))}

              <td className="sticky bottom-0 z-40 bg-white p-2 text-center">
                {grandTotalVolume1}
              </td>
              <td className="sticky bottom-0 z-40 bg-white p-2 text-center">
                {grandTotalVolume2}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
