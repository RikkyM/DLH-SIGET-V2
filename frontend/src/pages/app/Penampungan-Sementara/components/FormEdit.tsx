import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import type { PenampunganForm, PenampunganRes } from "../__types";
import { useDialog } from "@/hooks/useDialog";
import axios from "axios";
import { http } from "@/services/http";
import { useDepartments } from "@/hooks/useDepartments";
import { RefreshCw } from "lucide-react";
import { useJts } from "@/hooks/useJts";

const FormEdit = ({ refetch }: { refetch: () => void }) => {
  const { isOpen, data, closeDialog } = useDialog<PenampunganRes>();

  const {
    departments,
    refetch: getDepartment,
    loading: loadingDepartment,
  } = useDepartments();
  const { jts, refetch: getJts, loading: loadingJts } = useJts();

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

    if (departments.length > 0) return;
    if (jts.length > 0) return;

    getDepartment();
    getJts();
  }, [data, isOpen, getDepartment, getJts, departments.length, jts.length]);

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

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!data?.id) return;

    try {
      const res = await http.put(
        `/api/penampungan-sementara/${data.id}`,
        formData,
      );

      if (res) {
        refetch();
      }

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
      </form>
    </section>
  );
};

export default FormEdit;
