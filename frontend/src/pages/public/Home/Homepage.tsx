import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { http } from "@/services/http";
import type { LatLngExpression } from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MultiSelectDropdown, {
  type MultiSelectOption,
} from "@/components/ui/MultiSelectDropdown";
import logo from "@/assets/img/dlh-logo.webp";
// import { iconPetugas, iconTitikSampah } from "./icon";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import L from "leaflet";

// const makeImageIcon = (url: string) =>
//   L.icon({
//     iconUrl: url,
//     iconSize: [34, 34],
//     iconAnchor: [17, 33],
//     popupAnchor: [0, -30],
//   });

const makeImageIcon = (url: string, size: [number, number]) =>
  L.icon({
    iconUrl: url,
    iconSize: size,
    iconAnchor: [size[0] / 2, size[1] - 1], // biar nempel bawah tengah
    popupAnchor: [0, -size[1] + 4],
  });

type FiltersDepartmentsResponse = {
  departments: MultiSelectOption[];
};

type FiltersPenugasanResponse = {
  penugasan: MultiSelectOption[];
};

type FiltersPenampunganResponse = {
  penampungan: MultiSelectOption[];
};

type FiltersLambungResponse = {
  lambung: MultiSelectOption[];
};

type MapMarker = {
  id: number;
  nama: string;
  latitude: string | number;
  longitude: string | number;
  type: "petugas" | "titik_sampah";
  id_department: number | null;
  id_penugasan: number | null;
  rute_kerja: string;
  nama_jalan: string;
  kecamatan?: string;
  kelurahan?: string;
  vol_sampah: string;
  panjang_jalur: string;
  jenis: string;
  no_plat: string;
  armada: string;
  lambung: string;
  jenis_kendaraan: string;
  icon?: string | null;
};

const getDepartmentFilters = async () => {
  const res = await http.get<FiltersDepartmentsResponse>(
    "/api/filters/departments",
    {
      headers: { "Content-Type": "application/json" },
    },
  );
  return res.data;
};

const getPenugasanFilters = async (department: string[]) => {
  const res = await http.get<FiltersPenugasanResponse>(
    "/api/filters/penugasan",
    {
      params: { department },
      headers: { "Content-Type": "application/json" },
    },
  );
  return res.data;
};

const getPenampunganFilters = async (department: string[]) => {
  const res = await http.get<FiltersPenampunganResponse>(
    "/api/filters/penampungan",
    {
      params: { department },
      headers: { "Content-Type": "application/json" },
    },
  );
  return res.data;
};

const getLambungFilters = async (department: string[]) => {
  const res = await http.get<FiltersLambungResponse>("/api/filters/lambung", {
    params: { department },
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

const getMapMarkers = async (params: {
  department: string[];
  penugasan: string[];
  penampungan: string[]; // id_jts
  lambung: string[]; // armada
}) => {
  const res = await http.get<{ data: MapMarker[] }>("/api/homepage/map", {
    params: {
      department: params.department,
      penugasan: params.penugasan,
      penampungan: params.penampungan,
      lambung: params.lambung,
    },
    headers: { "Content-Type": "application/json" },
  });
  return res.data.data;
};

const Homepage = () => {
  useDocumentTitle("SIGET DLH PALEMBANG");

  const center: LatLngExpression = [-2.9761, 104.7754];

  const [optDepartment, setOptDepartment] = useState<MultiSelectOption[]>([]);
  const [optPenugasan, setOptPenugasan] = useState<MultiSelectOption[]>([]);
  const [optPenampungan, setOptPenampungan] = useState<MultiSelectOption[]>([]);
  const [optLambung, setOptLambung] = useState<MultiSelectOption[]>([]);

  const [departmentIds, setDepartmentIds] = useState<string[]>([]);
  const [penugasanIds, setPenugasanIds] = useState<string[]>([]);
  const [penampunganIds, setPenampunganIds] = useState<string[]>([]);
  const [lambungIds, setLambungIds] = useState<string[]>([]);

  const [loadingFilters, setLoadingFilters] = useState(false);
  const [errorFilters, setErrorFilters] = useState<string | null>(null);

  const [markers, setMarkers] = useState<MapMarker[]>([]);
  // const [loadingMarkers, setLoadingMarkers] = useState(false);
  // const [errorMarkers, setErrorMarkers] = useState<string | null>(null);

  // load dropdown options
  useEffect(() => {
    let alive = true;

    (async () => {
      setLoadingFilters(true);
      setErrorFilters(null);

      try {
        const department = await getDepartmentFilters();
        const penugasan = await getPenugasanFilters(departmentIds);
        const penampungan = await getPenampunganFilters(departmentIds);
        const lambung = await getLambungFilters(departmentIds);
        if (!alive) return;

        setOptDepartment(department.departments ?? []);
        setOptPenugasan(penugasan.penugasan ?? []);
        setOptPenampungan(penampungan.penampungan ?? []);
        setOptLambung(lambung.lambung ?? []);

        const validPenugasan = new Set(
          (penugasan.penugasan ?? []).map((o) => o.value),
        );
        setPenugasanIds((prev) => prev.filter((v) => validPenugasan.has(v)));

        const validPenampungan = new Set(
          (penampungan.penampungan ?? []).map((o) => o.value),
        );
        setPenampunganIds((prev) =>
          prev.filter((v) => validPenampungan.has(v)),
        );

        const validLambung = new Set(
          (lambung.lambung ?? []).map((o) => o.value),
        );
        setLambungIds((prev) => prev.filter((v) => validLambung.has(v)));
      } catch (e: unknown) {
        if (!alive) return;
        if (axios.isAxiosError(e)) {
          setErrorFilters(
            e?.response?.data?.message ?? e?.message ?? "Gagal load filters",
          );
        }
      } finally {
        if (alive) setLoadingFilters(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [departmentIds]);

  // load markers whenever filter changes
  useEffect(() => {
    let alive = true;

    (async () => {
      // setLoadingMarkers(true);
      // setErrorMarkers(null);

      try {
        const data = await getMapMarkers({
          department: departmentIds,
          penugasan: penugasanIds,
          penampungan: penampunganIds,
          lambung: lambungIds,
        });
        if (!alive) return;

        setMarkers(data);
      } catch {
        if (!alive) return;
        // if (axios.isAxiosError(e)) {
        //   setErrorMarkers(
        //     e?.response?.data?.message ?? e?.message ?? "Gagal load marker",
        //   );
        // }
      } finally {
        // if (alive) setLoadingMarkers(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [departmentIds, penugasanIds, penampunganIds, lambungIds]);

  useEffect(() => {
    setPenugasanIds([]);
    setPenampunganIds([]);
    setLambungIds([]);
  }, [departmentIds]);

  const leafletMarkers = useMemo(() => {
    return markers
      .map((m) => {
        const lat = Number(m.latitude);
        const lng = Number(m.longitude);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
        return { ...m, lat, lng };
      })
      .filter(Boolean) as Array<MapMarker & { lat: number; lng: number }>;
  }, [markers]);

  return (
    <section className="h-[calc(100dvh-200px)] w-full p-4">
      <div className="relative z-10 mb-3 grid grid-cols-1 gap-2 md:grid-cols-4">
        <MultiSelectDropdown
          label="Wilayah UPTD"
          placeholder={loadingFilters ? "Loading..." : "Pilih Wilayah"}
          options={optDepartment}
          value={departmentIds}
          onChange={setDepartmentIds}
          showCount={false}
        />

        <MultiSelectDropdown
          label="Petugas Kebersihan"
          placeholder={
            loadingFilters ? "Loading..." : "Pilih Petugas Kebersihan"
          }
          options={optPenugasan}
          value={penugasanIds}
          onChange={setPenugasanIds}
        />
        <MultiSelectDropdown
          label="Penampungan Sampah"
          placeholder={
            loadingFilters ? "Loading..." : "Pilih Penampungan Sampah"
          }
          options={optPenampungan}
          value={penampunganIds}
          onChange={setPenampunganIds}
        />
        <MultiSelectDropdown
          label="Nomor Plat"
          placeholder={loadingFilters ? "Loading..." : "Pilih Nomor Plat"}
          options={optLambung}
          value={lambungIds}
          onChange={setLambungIds}
          showLambung={true}
        />
        <p className="text-sm text-red-500">{errorFilters}</p>
        {/* <div className="rounded-md border border-slate-200 bg-white p-3 text-xs text-slate-600">
          <div>Marker: {leafletMarkers.length}</div>
          {loadingMarkers ? (
            <div className="mt-1">Loading marker...</div>
          ) : null}
          {errorMarkers ? (
            <div className="mt-1 text-red-600">{errorMarkers}</div>
          ) : null}
        </div> */}
      </div>

      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom
        style={{ height: "100%", width: "100%", zIndex: "0" }}
      >
        <TileLayer
          //   attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* {leafletMarkers.map((m) => (
          <Marker key={`${m.type}-${m.id}`} position={[m.lat, m.lng]}>
            <Popup>
              <div className="flex items-start gap-3">
                <img
                  src={logo}
                  alt="logo"
                  className="h-12 w-12 shrink-0 rounded object-contain"
                />

                <div className="min-w-0 flex-1">
                  <div className="font-semibold">{m.nama}</div>
                  {m.type === "titik_sampah" && (
                    <>
                      <div className="text-xs text-slate-600">
                        {m?.jenis ?? "-"}
                      </div>
                      <div className="text-xs text-slate-600">
                        {m?.no_plat ?? "-"}, ({m?.lambung})
                      </div>
                      <div className="text-xs text-slate-600">
                        {m?.jenis_kendaraan ?? "-"}
                      </div>
                    </>
                  )}
                  <div className="capitalize">
                    {m.nama_jalan}, {m?.kecamatan ?? "-"}, {m?.kelurahan ?? "-"}
                  </div>
                  {m.rute_kerja && (
                    <div className="text-xs text-slate-600">
                      {m?.rute_kerja ?? "-"}
                    </div>
                  )}
                  {m.type === "petugas" && (
                    <div className="text-xs text-slate-600">
                      Panjang Rute:{" "}
                      {m?.panjang_jalur ? `${m.panjang_jalur} M` : "-"}
                    </div>
                  )}
                  {m.vol_sampah ? (
                    <div className="text-xs text-slate-600">
                      Volume Sampah: {m?.vol_sampah} KG
                    </div>
                  ) : null}
                </div>
              </div>
            </Popup>
          </Marker>
        ))} */}
        {/* {leafletMarkers.map((m) => {
          const markerIcon = m.icon ? makeImageIcon(m.icon) : undefined; */}
        {leafletMarkers.map((m) => {
          const size: [number, number] =
            m.type === "petugas" ? [50, 50] : [30, 30];

          const markerIcon = m.icon ? makeImageIcon(m.icon, size) : undefined;
          // m.type === "petugas"
          //   ? m.icon
          //     ? makeImageIcon(m.icon)
          //     : undefined // fallback default Leaflet
          //   : iconTitikSampah; // titik sampah tetap divIcon merah

          return (
            <Marker
              key={`${m.type}-${m.id}`}
              position={[m.lat, m.lng]}
              {...(markerIcon ? { icon: markerIcon } : {})}
            >
              <Popup>
                <div className="flex items-start gap-3">
                  <img
                    src={logo}
                    alt="logo"
                    className="h-12 w-12 shrink-0 rounded object-contain"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="font-semibold">{m.nama}</div>
                    {m.type === "titik_sampah" && (
                      <>
                        <div className="text-xs text-slate-600">
                          {m?.jenis ?? "-"}
                        </div>
                        <div className="text-xs text-slate-600">
                          {m?.armada ?? "-"}, ({m?.lambung})
                        </div>
                        <div className="text-xs text-slate-600">
                          {m?.jenis_kendaraan ?? "-"}
                        </div>
                      </>
                    )}
                    <div className="capitalize">
                      {m.nama_jalan}, {m?.kecamatan ?? "-"},{" "}
                      {m?.kelurahan ?? "-"}
                    </div>
                    {m.rute_kerja && (
                      <div className="text-xs text-slate-600">
                        {m?.rute_kerja ?? "-"}
                      </div>
                    )}
                    {m.type === "petugas" && (
                      <div className="text-xs text-slate-600">
                        Panjang Rute:{" "}
                        {m?.panjang_jalur ? `${m.panjang_jalur} M` : "-"}
                      </div>
                    )}
                    {m.vol_sampah ? (
                      <div className="text-xs text-slate-600">
                        Volume Sampah: {m?.vol_sampah} KG
                      </div>
                    ) : null}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </section>
  );
};

export default Homepage;
