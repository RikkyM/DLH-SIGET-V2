import { useDialog } from "@/hooks/useDialog";
import axios from "axios";
import type { KendaraanRes } from "../__types";
import {
  memo,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { http } from "@/services/http";
import { useJenisKendaraan } from "@/hooks/useJenisKendaraan";
import { RefreshCw } from "lucide-react";
import { usePetugasFilter } from "@/hooks/usePetugasFilter";

type State = {
  id_jenis: number | null;
  id_department: number | null;
  id_petugas: number | null;
  no_plat: string;
  merk: string;
  lambung_baru: string;
  no_rangka: string;
  no_mesin: string;
  no_stnk: string;
  tahun_pembuatan: string;
  kapasitas_mesin: string;
  warna: string;
  berat: string;
  jumlah_kontainer: string;
  kondisi: string;
  foto_kendaraan: string;
  keterangan: string;
};

type ValidationErrors = Record<string, string[]>;

type ApiError = {
  message?: string;
  errors?: ValidationErrors;
};

type FotoState = {
  foto_depan: File | null;
  foto_belakang: File | null;
  foto_kanan: File | null;
  foto_kiri: File | null;
};

const initialState: State = {
  id_jenis: null,
  id_department: null,
  id_petugas: null,
  no_plat: "",
  merk: "",
  lambung_baru: "",
  no_rangka: "",
  no_mesin: "",
  no_stnk: "",
  tahun_pembuatan: "",
  kapasitas_mesin: "",
  warna: "",
  berat: "",
  jumlah_kontainer: "",
  kondisi: "",
  foto_kendaraan: "",
  keterangan: "",
};

const FormEdit = ({ refetch }: { refetch: () => void }) => {
  const { isOpen, data, closeDialog } = useDialog<KendaraanRes>();

  const { jenisKendaraan, loading: loadingJk } = useJenisKendaraan();
  const { petugas, loading: loadingPetugas } = usePetugasFilter();

  const [formData, setFormData] = useState<State>(initialState);
  const [foto, setFoto] = useState<FotoState>({
    foto_depan: null,
    foto_belakang: null,
    foto_kanan: null,
    foto_kiri: null,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const fotoDepanRef = useRef<HTMLInputElement>(null);
  const fotoBelakangRef = useRef<HTMLInputElement>(null);
  const fotoKananRef = useRef<HTMLInputElement>(null);
  const fotoKiriRef = useRef<HTMLInputElement>(null);

  const resetFileInputs = () => {
    if (fotoDepanRef.current) fotoDepanRef.current.value = "";
    if (fotoBelakangRef.current) fotoBelakangRef.current.value = "";
    if (fotoKananRef.current) fotoKananRef.current.value = "";
    if (fotoKiriRef.current) fotoKiriRef.current.value = "";

    setFoto({
      foto_depan: null,
      foto_belakang: null,
      foto_kanan: null,
      foto_kiri: null,
    });
  };

  useEffect(() => {
    if (!isOpen || !data?.id) return;

    setFormData((prev) => ({
      ...prev,
      ...initialState,
      ...data,
      foto_kendaraan: "",
    }));

    setErrors({});
    resetFileInputs();
  }, [isOpen, data]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    e.preventDefault();

    const { name, value } = e.target;

    if (name === "tahun_pembuatan") {
      const digitOnly = value.replace(/\D+/g, "");
      setFormData((prev) => ({ ...prev, tahun_pembuatan: digitOnly }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      ...(name === "id_jenis" ||
      name === "id_department" ||
      name === "id_petugas"
        ? { [name]: value ? Number(value) : null }
        : { [name]: value }),
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (!files?.length) return;

    setFoto((prev) => ({
      ...prev,
      [name]: files[0],
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!data?.id) return;

    const fd = new FormData();

    Object.entries(formData).forEach(([Key, value]) => {
      if (value === null || value === "") return;
      fd.append(Key, String(value));
    });

    Object.entries(foto).forEach(([Key, file]) => {
      if (file) {
        fd.append(Key, file);
      }
    });

    setLoading(true);
    setErrors({});

    try {
      fd.append("_method", "PUT");
      await http.post(`/api/data-kendaraan/${data.id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      refetch();
      resetFileInputs();
      closeDialog();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 422) {
          const payload = err.response.data as ApiError;

          if (payload?.errors) setErrors(payload.errors);
          return;
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const fieldError = (name: string) => errors?.[name]?.[0];

  return (
    <section
      onClick={(e) => e.stopPropagation()}
      className={`max-h-full w-full max-w-4xl space-y-3 overflow-auto rounded-sm bg-white p-3 shadow transition-all duration-300 ${
        isOpen ? "scale-100" : "scale-95"
      }`}
    >
      <h2 className="font-semibold lg:text-lg">Edit Data Kendaraan</h2>
      <form
        onSubmit={handleSubmit}
        className="grid gap-5 md:grid-cols-2 lg:grid-cols-4"
        encType="multipart/form-data"
      >
        <div className="space-y-1 text-sm lg:col-span-2">
          <label htmlFor="no_plat" className="block w-max font-medium">
            No. TNKB
          </label>
          <input
            className="w-full rounded border border-gray-300 bg-transparent px-3 py-1.5 focus:ring focus:ring-blue-400 focus:outline-none"
            type="text"
            id="no_plat"
            name="no_plat"
            placeholder="Masukkan nomor tnkb..."
            value={formData?.no_plat || ""}
            onChange={handleChange}
          />
          {fieldError("no_plat") && (
            <p className="text-xs text-red-600">{fieldError("no_plat")}</p>
          )}
        </div>
        <div className="space-y-1 text-sm lg:col-span-2">
          <label htmlFor="merk" className="block w-max font-medium">
            Merk
          </label>
          <input
            className="w-full rounded border border-gray-300 bg-transparent px-3 py-1.5 focus:ring focus:ring-blue-400 focus:outline-none"
            type="text"
            id="merk"
            name="merk"
            placeholder="Masukkan merk kendaraan..."
            value={formData?.merk || ""}
            onChange={handleChange}
          />
          {fieldError("merk") && (
            <p className="text-xs text-red-600">{fieldError("merk")}</p>
          )}
        </div>
        <div className="space-y-1 text-sm">
          <label htmlFor="jenis_kendaraan" className="block w-max font-medium">
            Jenis Kendaraan
          </label>
          {loadingJk ? (
            <RefreshCw className="max-w-4.5 animate-spin" />
          ) : (
            <select
              id="jenis_kendaraan"
              name="id_jenis"
              className="w-full cursor-pointer appearance-none rounded border border-gray-300 bg-transparent px-3 py-1.5 focus:ring focus:ring-blue-400 focus:outline-none"
              value={formData?.id_jenis || ""}
              onChange={handleChange}
            >
              <option value="">Pilih Jenis Kendaraan</option>
              {jenisKendaraan.map((data, idx) => (
                <option key={data.id ?? idx} value={data.id}>
                  {data.nama}
                </option>
              ))}
            </select>
          )}
          {fieldError("id_jenis") && (
            <p className="text-xs text-red-600">{fieldError("id_jenis")}</p>
          )}
        </div>
        <div className="space-y-1 text-sm">
          <label htmlFor="no_lambung" className="block w-max font-medium">
            No. Lambung
          </label>
          <input
            className="w-full rounded border border-gray-300 bg-transparent px-3 py-1.5 focus:ring focus:ring-blue-400 focus:outline-none"
            type="text"
            id="no_lambung"
            name="lambung_baru"
            placeholder="Masukkan nomor lambung..."
            value={formData?.lambung_baru || ""}
            onChange={handleChange}
          />
          {fieldError("lambung_baru") && (
            <p className="text-xs text-red-600">{fieldError("lambung_baru")}</p>
          )}
        </div>
        <div className="space-y-1 text-sm">
          <label htmlFor="no_rangka" className="block w-max font-medium">
            No. Rangka
          </label>
          <input
            className="w-full rounded border border-gray-300 bg-transparent px-3 py-1.5 focus:ring focus:ring-blue-400 focus:outline-none"
            type="text"
            id="no_rangka"
            name="no_rangka"
            placeholder="Masukkan nomor rangka..."
            value={formData?.no_rangka || ""}
            onChange={handleChange}
          />
          {fieldError("no_rangka") && (
            <p className="text-xs text-red-600">{fieldError("no_rangka")}</p>
          )}
        </div>
        <div className="space-y-1 text-sm">
          <label htmlFor="no_mesin" className="block w-max font-medium">
            No. Mesin
          </label>
          <input
            className="w-full rounded border border-gray-300 bg-transparent px-3 py-1.5 focus:ring focus:ring-blue-400 focus:outline-none"
            type="text"
            id="no_mesin"
            name="no_mesin"
            placeholder="Masukkan nomor mesin..."
            value={formData?.no_mesin || ""}
            onChange={handleChange}
          />
          {fieldError("no_mesin") && (
            <p className="text-xs text-red-600">{fieldError("no_mesin")}</p>
          )}
        </div>
        <div className="space-y-1 text-sm">
          <label htmlFor="no_stnk" className="block w-max font-medium">
            No. STNK
          </label>
          <input
            className="w-full rounded border border-gray-300 bg-transparent px-3 py-1.5 focus:ring focus:ring-blue-400 focus:outline-none"
            type="text"
            id="no_stnk"
            name="no_stnk"
            placeholder="Masukkan nomor stnk..."
            value={formData?.no_stnk || ""}
            onChange={handleChange}
          />
          {fieldError("no_stnk") && (
            <p className="text-xs text-red-600">{fieldError("no_stnk")}</p>
          )}
        </div>
        <div className="space-y-1 text-sm">
          <label htmlFor="tahun_pembuatan" className="block w-max font-medium">
            Tahun Pembuatan
          </label>
          <input
            className="w-full rounded border border-gray-300 bg-transparent px-3 py-1.5 focus:ring focus:ring-blue-400 focus:outline-none"
            type="text"
            id="tahun_pembuatan"
            name="tahun_pembuatan"
            placeholder="Masukkan tahun pembuatan..."
            value={formData?.tahun_pembuatan || ""}
            onChange={handleChange}
          />
          {fieldError("tahun_pembuatan") && (
            <p className="text-xs text-red-600">
              {fieldError("tahun_pembuatan")}
            </p>
          )}
        </div>
        <div className="space-y-1 text-sm">
          <label htmlFor="kapasitas_mesin" className="block w-max font-medium">
            Kapasitas Mesin
          </label>
          <input
            className="w-full rounded border border-gray-300 bg-transparent px-3 py-1.5 focus:ring focus:ring-blue-400 focus:outline-none"
            type="text"
            id="kapasitas_mesin"
            name="kapasitas_mesin"
            placeholder="Masukkan kapasitas mesin..."
            value={formData?.kapasitas_mesin || ""}
            onChange={handleChange}
          />
          {fieldError("kapasitas_mesin") && (
            <p className="text-xs text-red-600">
              {fieldError("kapasitas_mesin")}
            </p>
          )}
        </div>
        <div className="space-y-1 text-sm">
          <label htmlFor="warna" className="block w-max font-medium">
            Warna Kendaraan
          </label>
          <input
            className="w-full rounded border border-gray-300 bg-transparent px-3 py-1.5 focus:ring focus:ring-blue-400 focus:outline-none"
            type="text"
            id="warna"
            name="warna"
            placeholder="Masukkan warna kendaraan..."
            value={formData?.warna || ""}
            onChange={handleChange}
          />
          {fieldError("warna") && (
            <p className="text-xs text-red-600">{fieldError("warna")}</p>
          )}
        </div>
        <div className="space-y-1 text-sm">
          <label htmlFor="berat" className="block w-max font-medium">
            Berat Kendaraan
          </label>
          <input
            className="w-full rounded border border-gray-300 bg-transparent px-3 py-1.5 focus:ring focus:ring-blue-400 focus:outline-none"
            type="text"
            id="berat"
            name="berat"
            placeholder="Masukkan berat kendaraan..."
            value={formData?.berat || ""}
            onChange={handleChange}
          />
          {fieldError("berat") && (
            <p className="text-xs text-red-600">{fieldError("berat")}</p>
          )}
        </div>
        <div className="space-y-1 text-sm">
          <label htmlFor="jumlah_kontainer" className="block w-max font-medium">
            Jumlah Kontainer
          </label>
          <input
            className="w-full rounded border border-gray-300 bg-transparent px-3 py-1.5 focus:ring focus:ring-blue-400 focus:outline-none"
            type="text"
            id="jumlah_kontainer"
            name="jumlah_kontainer"
            placeholder="Masukkan jumlah kontainer..."
            value={formData?.jumlah_kontainer || ""}
            onChange={handleChange}
          />
          {fieldError("jumlah_kontainer") && (
            <p className="text-xs text-red-600">
              {fieldError("jumlah_kontainer")}
            </p>
          )}
        </div>
        <div className="space-y-1 text-sm">
          <label htmlFor="kondisi" className="block w-max font-medium">
            Kondisi Kendaraan
          </label>
          <select
            id="kondisi"
            name="kondisi"
            className="w-full cursor-pointer appearance-none rounded border border-gray-300 bg-transparent px-3 py-1.5 focus:ring focus:ring-blue-400 focus:outline-none"
            value={formData?.kondisi || ""}
            onChange={handleChange}
          >
            <option value="">Pilih Kondisi Kendaraan</option>
            <option value="BAIK">Baik</option>
            <option value="RUSAK RINGAN">Rusak Ringan</option>
            <option value="RUSAK BERAT">Rusak Berat</option>
          </select>
          {fieldError("kondisi") && (
            <p className="text-xs text-red-600">{fieldError("kondisi")}</p>
          )}
        </div>
        <div className="space-y-1 text-sm">
          <label htmlFor="petugas" className="block w-max font-medium">
            Nama Petugas
          </label>
          {loadingPetugas ? (
            <RefreshCw className="max-w-4.5 animate-spin" />
          ) : (
            <select
              id="petugas"
              name="id_petugas"
              className="w-full cursor-pointer appearance-none rounded border border-gray-300 bg-transparent px-3 py-1.5 focus:ring focus:ring-blue-400 focus:outline-none"
              value={formData?.id_petugas || ""}
              onChange={handleChange}
            >
              <option value="">Pilih Petugas</option>
              {petugas.map((data, idx) => (
                <option key={data.id ?? idx} value={data.id}>
                  {data.nama}
                </option>
              ))}
            </select>
          )}
          {fieldError("id_petugas") && (
            <p className="text-xs text-red-600">{fieldError("id_petugas")}</p>
          )}
        </div>
        <div className="space-y-1 text-sm md:col-span-2 lg:col-span-4">
          <label htmlFor="keterangan" className="block w-max font-medium">
            Keterangan
          </label>
          <input
            className="w-full rounded border border-gray-300 bg-transparent px-3 py-1.5 focus:ring focus:ring-blue-400 focus:outline-none"
            type="text"
            id="keterangan"
            name="keterangan"
            placeholder="Keterangan..."
            value={formData?.keterangan || ""}
            onChange={handleChange}
          />
          {fieldError("keterangan") && (
            <p className="text-xs text-red-600">{fieldError("keterangan")}</p>
          )}
        </div>

        <div className="grid gap-5 md:col-span-2 md:grid-cols-2 lg:col-span-4 lg:grid-cols-4">
          <h2 className="border-b font-medium md:col-span-2 lg:col-span-4">
            Foto Kendaraan
          </h2>
          <div className="space-y-1 text-sm">
            <label htmlFor="foto_depan" className="block w-max font-medium">
              Foto Depan
            </label>
            <input
              ref={fotoDepanRef}
              className="w-full cursor-pointer rounded border border-gray-300 bg-transparent px-3 py-1.5 focus:ring focus:ring-blue-400 focus:outline-none"
              type="file"
              accept="image/*"
              id="foto_depan"
              name="foto_depan"
              onChange={handleFileChange}
            />
            {data?.foto_kendaraan?.foto_depan && (
              <a
                href={`${import.meta.env.VITE_API_BASE}/api/data-kendaraan/${data.id}/foto_depan/icon?v=${encodeURIComponent(data.updated_at ?? "")}`}
                rel="noreferrer noopener"
                className="text-blue-500 hover:underline"
                target="_blank"
              >
                Lihat foto
              </a>
            )}
            {fieldError("foto_depan") && (
              <p className="text-xs text-red-600">{fieldError("foto_depan")}</p>
            )}
          </div>
          <div className="space-y-1 text-sm">
            <label htmlFor="foto_belakang" className="block w-max font-medium">
              Foto Belakang
            </label>
            <input
              ref={fotoBelakangRef}
              className="w-full cursor-pointer rounded border border-gray-300 bg-transparent px-3 py-1.5 focus:ring focus:ring-blue-400 focus:outline-none"
              type="file"
              accept="image/*"
              id="foto_belakang"
              name="foto_belakang"
              onChange={handleFileChange}
            />
            {data?.foto_kendaraan?.foto_belakang && (
              <a
                href={`${import.meta.env.VITE_API_BASE}/api/data-kendaraan/${data.id}/foto_belakang/icon?v=${encodeURIComponent(data.updated_at ?? "")}`}
                rel="noreferrer noopener"
                className="text-blue-500 hover:underline"
                target="_blank"
              >
                Lihat foto
              </a>
            )}
            {fieldError("foto_belakang") && (
              <p className="text-xs text-red-600">
                {fieldError("foto_belakang")}
              </p>
            )}
          </div>
          <div className="space-y-1 text-sm">
            <label htmlFor="foto_kanan" className="block w-max font-medium">
              Foto Kanan
            </label>
            <input
              ref={fotoKananRef}
              className="w-full cursor-pointer rounded border border-gray-300 bg-transparent px-3 py-1.5 focus:ring focus:ring-blue-400 focus:outline-none"
              type="file"
              accept="image/*"
              id="foto_kanan"
              name="foto_kanan"
              onChange={handleFileChange}
            />
            {data?.foto_kendaraan?.foto_kanan && (
              <a
                href={`${import.meta.env.VITE_API_BASE}/api/data-kendaraan/${data.id}/foto_kanan/icon?v=${encodeURIComponent(data.updated_at ?? "")}`}
                rel="noreferrer noopener"
                className="text-blue-500 hover:underline"
                target="_blank"
              >
                Lihat foto
              </a>
            )}
            {fieldError("foto_kanan") && (
              <p className="text-xs text-red-600">{fieldError("foto_kanan")}</p>
            )}
          </div>
          <div className="space-y-1 text-sm">
            <label htmlFor="foto_kiri" className="block w-max font-medium">
              Foto Kiri
            </label>
            <input
              ref={fotoKiriRef}
              className="w-full cursor-pointer rounded border border-gray-300 bg-transparent px-3 py-1.5 focus:ring focus:ring-blue-400 focus:outline-none"
              type="file"
              accept="image/*"
              id="foto_kiri"
              name="foto_kiri"
              onChange={handleFileChange}
            />
            {data?.foto_kendaraan?.foto_kiri && (
              <a
                href={`${import.meta.env.VITE_API_BASE}/api/data-kendaraan/${data.id}/foto_kiri/icon?v=${encodeURIComponent(data.updated_at ?? "")}`}
                rel="noreferrer noopener"
                className="text-blue-500 hover:underline"
                target="_blank"
              >
                Lihat foto
              </a>
            )}
            {fieldError("foto_kiri") && (
              <p className="text-xs text-red-600">{fieldError("foto_kiri")}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 place-self-end md:col-span-2 lg:col-span-4">
          <button
            type="button"
            onClick={() => closeDialog()}
            className="cursor-pointer rounded bg-red-500 px-3 py-1 text-sm font-medium text-white"
          >
            Batal
          </button>
          <button
            type="submit"
            className="cursor-pointer rounded bg-blue-500 px-3 py-1 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Loading..." : "Update"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default memo(FormEdit);
