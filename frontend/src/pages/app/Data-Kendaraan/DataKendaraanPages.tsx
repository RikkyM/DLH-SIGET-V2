import { ChevronDown } from "lucide-react";


const DataKendaraanPages = () => {
  return (
    <section className="flex flex-1 flex-col gap-3 overflow-auto p-3">
      <div className="flex h-full flex-col gap-2 overflow-auto rounded-lg bg-white p-3 shadow">
        <div className="space-y-2">
          <h4 className="text-xl font-semibold">
            Data Kendaraan
          </h4>

          <div className="flex flex-wrap items-center gap-2">
            <label htmlFor="search" className="inline-block">
              <input
                type="search"
                id="search"
                // value={search}
                // onChange={(e) => setSearch(e.target.value)}
                name="search"
                placeholder="Search..."
                autoComplete="off"
                className="rounded-sm border border-gray-400 px-3 py-2 text-sm focus:ring focus:ring-blue-300 focus:outline-none"
              />
            </label>

            <div className="flex items-center gap-2 text-sm text-gray-700">
              Show:
              <label
                htmlFor="per_page"
                className="relative flex items-center gap-1.5 rounded border border-gray-400 text-sm"
              >
                <select
                  id="per_page"
                  name="per_page"
                  className="cursor-pointer appearance-none py-2 pr-8 pl-3 focus:outline-none"
                //   value={perPage}
                //   onChange={(e) => setPerPage(Number(e.target.value))}
                >
                  {[10, 25, 50, 100].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 max-w-4" />
              </label>
            </div>

            {/* <div className="flex items-center gap-2 text-sm text-gray-700">
              Filter:
              <label
                htmlFor="unit_kerja"
                className="relative flex items-center gap-1.5 rounded border border-gray-400 text-sm"
              >
                <select
                  id="unit_kerja"
                  name="unit_kerja"
                  className="cursor-pointer appearance-none py-2 pr-8 pl-3 focus:outline-none"
                  value={unitKerja}
                  onChange={(e) => {
                    setUnitKerja(Number(e.target.value));
                  }}
                >
                  <option value="">Pilih Unit Kerja</option>
                  {departments.map((dept, index) => (
                    <option key={dept.id ?? index} value={dept.id}>
                      {dept.nama}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 max-w-4" />
              </label>
              <label
                htmlFor="id_jts"
                className="relative flex items-center gap-1.5 rounded border border-gray-400 text-sm"
              >
                <select
                  id="id_jts"
                  name="id_jts"
                  className="cursor-pointer appearance-none py-2 pr-8 pl-3 focus:outline-none"
                  value={jts}
                  onChange={(e) => {
                    setJts(Number(e.target.value));
                  }}
                >
                  <option value="">Pilih Jenis Titik Sampah</option>
                  {dataJts.map((dept, index) => (
                    <option key={dept.id ?? index} value={dept.id}>
                      {dept.nama}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 max-w-4" />
              </label>
              <label
                htmlFor="id_jk"
                className="relative flex items-center gap-1.5 rounded border border-gray-400 text-sm"
              >
                <select
                  id="id_jk"
                  name="id_jk"
                  className="cursor-pointer appearance-none py-2 pr-8 pl-3 focus:outline-none"
                  value={jenisKendaraan}
                  onChange={(e) => {
                    setJenisKendaraan(Number(e.target.value));
                  }}
                >
                  <option value="">Pilih Jenis Kendaraan</option>
                  {dataJk.map((dept, index) => (
                    <option key={dept.id ?? index} value={dept.id}>
                      {dept.nama}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 max-w-4" />
              </label>
            </div> */}
          </div>

          {/* {error ? <p className="text-sm text-red-600">{error}</p> : null} */}
        </div>
      </div>
    </section>
  );
};

export default DataKendaraanPages;
