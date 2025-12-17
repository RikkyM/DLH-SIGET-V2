import { http } from "@/services/http.services";
import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MultiSelectDropdown, {
  type MultiSelectOption,
} from "@/components/ui/MultiSelectDropdown";
import axios from "axios";
import type { LatLngExpression } from "leaflet";

type FiltersDepartmentsResponse = {
  departments: MultiSelectOption[];
};

type FiltersPenugasanResponse = {
  penugasan: MultiSelectOption[];
};

type PetugasMarker = {
  id: number;
  nama: string;
  latitude: string | number;
  longitude: string | number;
  id_department: number | null;
  id_penugasan: number | null;
};

const getDepartmentFilters = async () => {
  const res = await http.get<FiltersDepartmentsResponse>("/api/filters/departments", {
    headers: { Accept: "application/json" },
  });
  return res.data;
};

const getPenugasanFilters = async () => {
  const res = await http.get<FiltersPenugasanResponse>("/api/filters/penugasan", {
    headers: { Accept: "application/json" },
  });
  return res.data;
};

const getPetugasMarkers = async (params: {
  department: string[];
  penugasan: string[];
}) => {
  const res = await http.get<{ data: PetugasMarker[] }>(
    "/api/homepage/map",
    {
      params: {
        department: params.department, // axios => department[]=1&department[]=2
        penugasan: params.penugasan,
      },
      headers: { Accept: "application/json" },
    },
  );
  return res.data.data;
};

const Homepage = () => {
  const center: LatLngExpression = [-2.9761, 104.7754];

  const [optDepartment, setOptDepartment] = useState<MultiSelectOption[]>([]);
  const [optPenugasan, setOptPenugasan] = useState<MultiSelectOption[]>([]);

  const [departmentIds, setDepartmentIds] = useState<string[]>([]);
  const [penugasanIds, setPenugasanIds] = useState<string[]>([]);

  const [loadingFilters, setLoadingFilters] = useState(false);
  const [errorFilters, setErrorFilters] = useState<string | null>(null);

  console.log(errorFilters)

  const [markers, setMarkers] = useState<PetugasMarker[]>([]);
  const [loadingMarkers, setLoadingMarkers] = useState(false);
  const [errorMarkers, setErrorMarkers] = useState<string | null>(null);

  // load dropdown options
  useEffect(() => {
    let alive = true;

    (async () => {
      setLoadingFilters(true);
      setErrorFilters(null);

      try {
        const department = await getDepartmentFilters();
        const penugasan = await getPenugasanFilters();
        if (!alive) return;

        setOptDepartment(department.departments ?? []);
        setOptPenugasan(penugasan.penugasan ?? []);
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
  }, []);

  // load markers whenever filter changes
  useEffect(() => {
    let alive = true;

    (async () => {
      setLoadingMarkers(true);
      setErrorMarkers(null);

      try {
        const data = await getPetugasMarkers({
          department: departmentIds,
          penugasan: penugasanIds,
        });
        if (!alive) return;

        setMarkers(data);
      } catch (e: unknown) {
        if (!alive) return;
        if (axios.isAxiosError(e)) {
            setErrorMarkers(
              e?.response?.data?.message ?? e?.message ?? "Gagal load marker",
            );
        }
      } finally {
        if (alive) setLoadingMarkers(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [departmentIds, penugasanIds]);

  const leafletMarkers = useMemo(() => {
    return markers
      .map((m) => {
        const lat = Number(m.latitude);
        const lng = Number(m.longitude);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
        return { ...m, lat, lng };
      })
      .filter(Boolean) as Array<PetugasMarker & { lat: number; lng: number }>;
  }, [markers]);

  return (
    <section className="h-[calc(100dvh-200px)] w-full p-4">
      <div className="relative z-10 mb-3 grid grid-cols-1 gap-2 md:grid-cols-4">
        <MultiSelectDropdown
          label="Department"
          placeholder={loadingFilters ? "Loading..." : "Pilih Department"}
          options={optDepartment}
          value={departmentIds}
          onChange={setDepartmentIds}
        />

        <MultiSelectDropdown
          label="Penugasan"
          placeholder={loadingFilters ? "Loading..." : "Pilih Penugasan"}
          options={optPenugasan}
          value={penugasanIds}
          onChange={setPenugasanIds}
        />

        <div className="rounded-md border border-slate-200 bg-white p-3 text-xs text-slate-600">
          <div>Marker: {leafletMarkers.length}</div>
          {loadingMarkers ? (
            <div className="mt-1">Loading marker...</div>
          ) : null}
          {errorMarkers ? (
            <div className="mt-1 text-red-600">{errorMarkers}</div>
          ) : null}
        </div>
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

        {leafletMarkers.map((m) => (
          <Marker key={m.id} position={[m.lat, m.lng]}>
            <Popup>
              <div className="space-y-1">
                <div className="font-semibold">{m.nama}</div>
                <div className="text-xs">Dept: {m.id_department ?? "-"}</div>
                <div className="text-xs">
                  Penugasan: {m.id_penugasan ?? "-"}
                </div>
                <div className="text-xs">
                  {m.lat}, {m.lng}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </section>
  );
};

export default Homepage;
