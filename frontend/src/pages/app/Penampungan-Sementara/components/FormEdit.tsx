import axios from "axios";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import {
  memo,
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { RefreshCw } from "lucide-react";
import { http } from "@/services/http";
import type { PenampunganForm, PenampunganRes } from "../__types";
import { useDialog } from "@/hooks/useDialog";
import { useDepartments } from "@/hooks/useDepartments";
import { useJts } from "@/hooks/useJts";
import { useKendaraanFilter } from "@/hooks/useKendaraanFilter";
import { useKecamatanFilter } from "@/hooks/useKecamatanFilter";
import { useKelurahanFilter } from "@/hooks/useKelurahanFilter";

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL(
    "leaflet/dist/images/marker-icon-2x.png",
    import.meta.url,
  ).toString(),
  iconUrl: new URL(
    "leaflet/dist/images/marker-icon.png",
    import.meta.url,
  ).toString(),
  shadowUrl: new URL(
    "leaflet/dist/images/marker-shadow.png",
    import.meta.url,
  ).toString(),
});

const FormEdit = ({ refetch }: { refetch: () => void }) => {
  const { isOpen, data, closeDialog } = useDialog<PenampunganRes>();

  const [formData, setFormData] = useState<PenampunganForm>({
    id_jts: null,
    id_jk: null,
    id_department: null,
    id_kecamatan: null,
    id_kelurahan: null,
    armada: "",
    nama: "",
    nama_jalan: "",
    latitude: "",
    longitude: "",
    vol_sampah: "",
    status_kontainer: "",
    rute_kerja: "",
    keterangan: "",
  });

  const [foto, setFoto] = useState<File | null>(null);

  const {
    departments,
    refetch: getDepartment,
    loading: loadingDepartment,
  } = useDepartments();
  const { jts, refetch: getJts, loading: loadingJts } = useJts();
  const {
    kendaraan,
    refetch: getKendaraan,
    loading: loadingKendaraan,
  } = useKendaraanFilter();
  const {
    kecamatan,
    refetch: getKecamatan,
    loading: loadingKecamatan,
  } = useKecamatanFilter();
  const { kelurahan, loading: loadingKelurahan } = useKelurahanFilter(
    formData?.id_kecamatan,
  );

  useEffect(() => {
    if (!isOpen || !data?.id) return;

    setFormData({
      id_jts: data?.id_jts ?? null,
      id_jk: data?.id_jk ?? null,
      id_department: data?.id_department ?? null,
      id_kecamatan: data?.id_kecamatan ?? null,
      id_kelurahan: data?.id_kelurahan ?? null,
      armada: data?.armada ?? "",
      nama: data?.nama ?? "",
      nama_jalan: data?.nama_jalan ?? "",
      latitude: data?.latitude ?? "",
      longitude: data?.longitude ?? "",
      vol_sampah: data?.vol_sampah ?? "",
      status_kontainer: data?.status_kontainer ?? "",
      rute_kerja: data?.rute_kerja ?? "",
      keterangan: data?.keterangan ?? "",
    });
  }, [isOpen, data]);

  useEffect(() => {
    if (!isOpen) return;

    if (departments.length === 0) getDepartment();
    if (jts.length === 0) getJts();
    if (kendaraan.length === 0) getKendaraan();
    if (kecamatan.length === 0) getKecamatan();
  }, [
    isOpen,
    departments.length,
    jts.length,
    kendaraan.length,
    kecamatan.length,
    getDepartment,
    getJts,
    getKendaraan,
    getKecamatan,
  ]);

  const toNumber = (v?: string | number) => {
    const n = Number(String(v).trim());
    return Number.isFinite(n) ? n : null;
  };

  const MapRecenter = ({ lat, lng }: { lat: number; lng: number }) => {
    const map = useMap();
    useEffect(() => {
      map.setView([lat, lng], map.getZoom(), { animate: true });
    }, [lat, lng, map]);
    return null;
  };

  const MapClickSetter = ({
    onPick,
  }: {
    onPick: (lat: number, lng: number) => void;
  }) => {
    useMapEvents({
      click(e) {
        onPick(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    e.preventDefault();

    const { name, value } = e.target;

    if (name === "vol_sampah") {
      const digitOnly = value.replace(/\D+/g, "");
      setFormData((prev) => ({ ...prev, vol_sampah: digitOnly }));
      return;
    }

    if (name === "latitude" || name === "longitude") {
      const cleaned = value.replace(/[^0-9.-]/g, "");
      setFormData((prev) => ({ ...prev, [name]: cleaned }));
      return;
    }

    if (name === "id_kecamatan") {
      const id = value ? Number(value) : null;

      setFormData((prev) => ({
        ...prev,
        id_kecamatan: id,
        id_kelurahan: null, // reset kelurahan hanya saat kecamatan berubah
      }));
      return;
    }

    if (name === "id_kelurahan") {
      const id = value ? Number(value) : null;

      setFormData((prev) => ({
        ...prev,
        id_kelurahan: id,
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const buildMultipart = (data: PenampunganForm, foto: File | null) => {
    const fd = new FormData();

    fd.append("_method", "PUT");

    Object.entries(data).forEach(([key, value]) => {
      if (value === null || value === "") return;
      fd.append(key, String(value));
    });

    if (foto) fd.append("foto_lokasi", foto);

    return fd;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!data?.id) return;

    const fd = buildMultipart(formData, foto);

    try {
      await http.post(`/api/penampungan-sementara/${data.id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      refetch();
      closeDialog();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 422 && err.response.data?.errors) {
          return;
        }
      }
    } finally {
      console.log("asd");
    }
  };

  return (
    <section
      onClick={(e) => e.stopPropagation()}
      className={`max-h-full w-full max-w-4xl space-y-3 overflow-auto rounded-sm bg-white p-3 shadow transition-all duration-300 ${
        isOpen ? "scale-100" : "scale-95"
      }`}
    >
      <h2 className="font-semibold lg:text-lg">Edit TPS</h2>
      <form
        onSubmit={handleSubmit}
        className="grid gap-5 md:grid-cols-2 lg:grid-cols-4"
        encType="multipart/form-data"
      >
        <div className="space-y-1 text-sm">
          <label htmlFor="nama_tps" className="block font-medium">
            Nama TPS
          </label>
          <input
            className="w-full rounded border border-gray-300 bg-transparent px-3 py-1.5 focus:ring focus:ring-blue-400 focus:outline-none"
            type="text"
            id="nama_tps"
            name="nama"
            placeholder="Masukkan nama TPS..."
            value={formData?.nama || ""}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-1 text-sm">
          <label htmlFor="vol_sampah" className="block font-medium">
            Vol. Sampah
          </label>
          <div className="relative flex w-full items-center rounded border border-gray-300 bg-transparent focus-within:ring focus-within:ring-blue-400">
            <input
              className="w-full px-3 py-1.5 focus:outline-none"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              id="vol_sampah"
              name="vol_sampah"
              placeholder="Masukkan volume sampah..."
              value={formData?.vol_sampah || ""}
              onChange={handleChange}
            />
            <span className="pointer-events-none rounded-r-xs bg-gray-200 px-2 py-1.5 font-medium">
              kg
            </span>
          </div>
        </div>
        <div className="space-y-1 text-sm">
          <label htmlFor="department" className="block font-medium">
            Unit Kerja
          </label>

          {loadingDepartment ? (
            <RefreshCw className="max-w-4.5 animate-spin" />
          ) : (
            <select
              className="w-full cursor-pointer appearance-none rounded border border-gray-300 bg-transparent px-3 py-1.5 focus:ring focus:ring-blue-400 focus:outline-none"
              id="department"
              name="id_department"
              value={formData?.id_department || ""}
              onChange={handleChange}
            >
              <option value="" disabled hidden>
                Pilih Unit Kerja
              </option>
              {departments.map((p, index) => (
                <option key={p.id ?? index} value={p.id}>
                  {p.nama}
                </option>
              ))}
            </select>
          )}
          {/* {errorPenugasan && (
            <p className="text-xs text-red-500">{errorPenugasan}</p>
          )} */}
        </div>
        <div className="space-y-1 text-sm">
          <label htmlFor="jenis_tps" className="block font-medium">
            Jenis Titik Sampah
          </label>

          {loadingJts ? (
            <RefreshCw className="max-w-4.5 animate-spin" />
          ) : (
            <select
              className="w-full cursor-pointer appearance-none rounded border border-gray-300 bg-transparent px-3 py-1.5 focus:ring focus:ring-blue-400 focus:outline-none"
              id="jenis_tps"
              name="id_jts"
              value={formData?.id_jts || ""}
              onChange={handleChange}
            >
              <option value="" disabled hidden>
                Pilih Jenis Titik Sampah
              </option>
              {jts.map((p, index) => (
                <option key={p.id ?? index} value={p.id}>
                  {p.nama}
                </option>
              ))}
            </select>
          )}
          {/* {errorPenugasan && (
            <p className="text-xs text-red-500">{errorPenugasan}</p>
          )} */}
        </div>
        <div className="space-y-1 text-sm">
          <label htmlFor="armada" className="block font-medium">
            Armada
          </label>

          {loadingKendaraan ? (
            <RefreshCw className="max-w-4.5 animate-spin" />
          ) : (
            <select
              className="w-full cursor-pointer appearance-none rounded border border-gray-300 bg-transparent px-3 py-1.5 focus:ring focus:ring-blue-400 focus:outline-none"
              id="armada"
              name="armada"
              value={formData?.armada || ""}
              onChange={handleChange}
            >
              <option value="">Pilih Armada</option>
              {kendaraan.map((p, index) => (
                <option key={p.id ?? index} value={p.no_plat}>
                  {p.no_plat}
                </option>
              ))}
            </select>
          )}
          {/* {errorPenugasan && (
            <p className="text-xs text-red-500">{errorPenugasan}</p>
          )} */}
        </div>
        <div className="space-y-1 text-sm">
          <label htmlFor="kecamatan" className="block font-medium">
            Kecamatan
          </label>

          {loadingKecamatan ? (
            <RefreshCw className="max-w-4.5 animate-spin" />
          ) : (
            <select
              className="w-full cursor-pointer appearance-none rounded border border-gray-300 bg-transparent px-3 py-1.5 focus:ring focus:ring-blue-400 focus:outline-none"
              id="kecamatan"
              name="id_kecamatan"
              value={formData?.id_kecamatan || ""}
              onChange={handleChange}
            >
              <option value="">Pilih Kecamatan</option>
              {kecamatan.map((p, index) => (
                <option key={p.id ?? index} value={p.id}>
                  {p.nama_kecamatan}
                </option>
              ))}
            </select>
          )}
          {/* {errorPenugasan && (
            <p className="text-xs text-red-500">{errorPenugasan}</p>
          )} */}
        </div>
        <div className="space-y-1 text-sm">
          <label htmlFor="kelurahan" className="block font-medium">
            Kelurahan
          </label>

          {loadingKelurahan ? (
            <RefreshCw className="max-w-4.5 animate-spin" />
          ) : (
            <select
              disabled={!formData.id_kecamatan}
              className="w-full cursor-pointer appearance-none rounded border border-gray-300 bg-transparent px-3 py-1.5 focus:ring focus:ring-blue-400 focus:outline-none disabled:cursor-not-allowed disabled:text-gray-400"
              id="kelurahan"
              name="id_kelurahan"
              // value={formData?.id_kelurahan || ""}
              value={
                formData.id_kelurahan != null
                  ? String(formData.id_kelurahan)
                  : ""
              }
              onChange={handleChange}
            >
              <option value="">
                {formData.id_kecamatan
                  ? "Pilih Kelurahan"
                  : "Pilih Kecamatan dulu"}
              </option>
              {kelurahan.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nama_kelurahan}
                </option>
              ))}
            </select>
          )}
          {/* {errorPenugasan && (
            <p className="text-xs text-red-500">{errorPenugasan}</p>
          )} */}
        </div>
        <div className="space-y-1 text-sm">
          <label htmlFor="status_kontainer" className="block font-medium">
            Status Kontainer
          </label>
          <select
            disabled={!formData.id_kecamatan}
            className="w-full cursor-pointer appearance-none rounded border border-gray-300 bg-transparent px-3 py-1.5 focus:ring focus:ring-blue-400 focus:outline-none"
            id="status_kontainer"
            name="status_kontainer"
            value={formData?.status_kontainer || ""}
            onChange={handleChange}
          >
            <option value="">
              {formData.id_kecamatan
                ? "Pilih Kelurahan"
                : "Pilih Kecamatan dulu"}
            </option>
            <option value="ada">Ada</option>
            <option value="tidak ada">Tidak Ada</option>
            <option value="bak sampah permanen">Bak Sampah Permanen</option>
          </select>
          {/* {errorPenugasan && (
            <p className="text-xs text-red-500">{errorPenugasan}</p>
          )} */}
        </div>
        <div className="space-y-1 text-sm md:col-span-2 lg:col-span-4">
          <label htmlFor="foto_lokasi" className="block font-medium">
            Foto Lokasi
          </label>

          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            className="w-full cursor-pointer rounded border border-gray-300 bg-transparent px-3 py-1.5 focus:ring focus:ring-blue-400 focus:outline-none"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              setFoto(file);
            }}
          />
          {/* {errorPenugasan && (
            <p className="text-xs text-red-500">{errorPenugasan}</p>
          )} */}
        </div>

        <div className="space-y-1 lg:col-span-2">
          <label htmlFor="latitude" className="block text-xs text-gray-500">
            Latitude
          </label>
          <input
            className="w-full rounded border border-gray-300 bg-transparent px-3 py-1.5 focus:ring focus:ring-blue-400 focus:outline-none"
            type="text"
            inputMode="decimal"
            id="latitude"
            name="latitude"
            placeholder="-2.9761"
            value={formData.latitude || ""}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-1 lg:col-span-2">
          <label htmlFor="longitude" className="block text-xs text-gray-500">
            Longitude
          </label>
          <input
            className="w-full rounded border border-gray-300 bg-transparent px-3 py-1.5 focus:ring focus:ring-blue-400 focus:outline-none"
            type="text"
            inputMode="decimal"
            id="longitude"
            name="longitude"
            placeholder="104.7754"
            value={formData.longitude || ""}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2 text-sm md:col-span-2 lg:col-span-4">
          <label className="block font-medium">Peta</label>

          <div className="mx-auto h-72 w-full overflow-hidden rounded border border-gray-300">
            {(() => {
              const lat = toNumber(formData.latitude);
              const lng = toNumber(formData.longitude);

              const center: [number, number] =
                lat !== null && lng !== null ? [lat, lng] : [-2.9761, 104.7754];

              return (
                <MapContainer
                  center={center}
                  zoom={16}
                  scrollWheelZoom
                  className="h-full w-full"
                >
                  <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  <MapClickSetter
                    onPick={(la, lo) => {
                      setFormData((prev) => ({
                        ...prev,
                        latitude: String(la),
                        longitude: String(lo),
                      }));
                    }}
                  />

                  {/* kalau user sudah punya koordinat valid, tampilkan marker + recenter */}
                  {lat !== null && lng !== null && (
                    <>
                      <Marker position={[lat, lng]} />
                      <MapRecenter lat={lat} lng={lng} />
                    </>
                  )}
                </MapContainer>
              );
            })()}
          </div>
        </div>

        <div className="col-span-4 flex items-center gap-2 place-self-end">
          <button
            type="button"
            onClick={() => closeDialog()}
            className="cursor-pointer rounded bg-red-500 px-3 py-1 text-sm font-medium text-white"
          >
            Batal
          </button>
          <button
            type="submit"
            className="cursor-pointer rounded bg-blue-500 px-3 py-1 text-sm font-medium text-white"
          >
            Update
          </button>
        </div>
      </form>
    </section>
  );
};

export default memo(FormEdit);
