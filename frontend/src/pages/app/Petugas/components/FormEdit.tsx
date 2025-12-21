import { useDialog } from "@/hooks/useDialog";
import {
  memo,
  // useEffect,
  // useState,
  // type ChangeEvent,
  // type FormEvent,
} from "react";
// import { RefreshCcw, RefreshCw } from "lucide-react";
import type { PetugasRes } from "../__types";
// import { http } from "@/services/http";
// import axios from "axios";
// import { usePenugasan } from "@/hooks/usePenugasan";

const FormEdit = () =>
  // { refetch = () => {} }: { refetch?: () => void }
  {
    const { isOpen, data, closeDialog } = useDialog<PetugasRes>();
    // const {
    //   penugasan,
    //   loading: loadingPenugasan,
    //   error: errorPenugasan,
    //   refetch: getPenugasan,
    // } = usePenugasan({ autoFetch: false });

    // const [formData, setFormData] = useState<PetugasForm>({
    //   id_penugasan: null,
    //   nama: "",
    //   rute_kerja: "",
    //   status: "",
    // });
    // const [loading, setLoading] = useState(false);

    // useEffect(() => {
    //   if (!isOpen || !data) return;

    //   setFormData({
    //     id_penugasan: data?.id_penugasan ?? null,
    //     nama: data?.nama ?? "",
    //     rute_kerja: data?.rute_kerja ?? "",
    //     status: data?.status ?? "",
    //   });

    //   // if (departments.length > 0) return;
    //   if (penugasan.length > 0) return;
    //   // getDept();
    //   getPenugasan();
    // }, [data, isOpen, getPenugasan, penugasan.length]);

    // const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    //   e.preventDefault();

    //   if (!data?.id) return;

    //   setLoading(true);

    //   try {
    //     const res = await http.put(`/api/petugas/${data.id}`, formData);

    //     if (res) {
    //       refetch();
    //     }

    //     closeDialog();
    //   } catch (err) {
    //     if (axios.isAxiosError(err)) {
    //       if (err.response?.status === 422 && err.response.data?.errors) {
    //         return;
    //       }
    //     }
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    // const handleChange = (
    //   e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    // ) => {
    //   const { name, value } = e.target;

    //   setFormData((prev) => ({
    //     ...prev,
    //     ...(name === "id_penugasan"
    //       ? { [name]: value ? Number(value) : null }
    //       : { [name]: value }),
    //   }));
    // };

    return (
      <section
        onClick={(e) => e.stopPropagation()}
        className={`max-h-full w-full max-w-4xl space-y-3 overflow-auto rounded-sm bg-white p-3 shadow transition-all duration-300 ${
          isOpen ? "scale-100" : "scale-95"
        }`}
      >
        <h2 className="font-semibold lg:text-lg">Detail Petugas</h2>
        {/* <form onSubmit={handleSubmit} className="w-full space-y-2">
        <div className="space-y-1 text-sm">
          <label htmlFor="nama" className="block font-medium">
            Nama Petugas
          </label>
          <input
            className="w-full rounded border border-gray-300 bg-transparent px-3 py-1.5 focus:ring focus:ring-blue-400 focus:outline-none"
            type="text"
            id="nama"
            name="nama"
            placeholder="Masukkan nama unit kerja..."
            value={formData?.nama || ""}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-1 text-sm">
          <label htmlFor="id_penugasan" className="block font-medium">
            Penugasan
          </label>

          {loadingPenugasan ? (
            <RefreshCw className="max-w-4.5 animate-spin" />
          ) : (
            <select
              className="w-full cursor-pointer appearance-none rounded border border-gray-300 bg-transparent px-3 py-1.5 focus:ring focus:ring-blue-400 focus:outline-none"
              id="id_penugasan"
              name="id_penugasan"
              value={formData?.id_penugasan || ""}
              onChange={handleChange}
            >
              <option value="" disabled hidden>
                Pilih Penugasan
              </option>
              {penugasan.map((p, index) => (
                <option key={p.id ?? index} value={p.id}>
                  {p.nama}
                </option>
              ))}
            </select>
          )}
          {errorPenugasan && (
            <p className="text-xs text-red-500">{errorPenugasan}</p>
          )}
        </div>
        <div className="space-y-1 text-sm">
          <label htmlFor="rute_kerja" className="block font-medium">
            Rute Kerja
          </label>
          <textarea
            className="max-h-20 min-h-16 w-full rounded border border-gray-300 bg-transparent px-3 py-1.5 focus:ring focus:ring-blue-400 focus:outline-none"
            id="rute_kerja"
            name="rute_kerja"
            placeholder="Masukkan rute kerja..."
            value={formData?.rute_kerja || ""}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-1 text-sm">
          <label htmlFor="status" className="block font-medium">
            Status
          </label>
          <select
            name="status"
            id="status"
            className="w-full cursor-pointer appearance-none rounded border border-gray-300 bg-transparent px-3 py-1.5 focus:ring focus:ring-blue-400 focus:outline-none"
            value={formData?.status ?? ""}
            onChange={handleChange}
          >
            <option value="" disabled hidden>
              Pilih Status
            </option>
            <option value="aktif" className="text-xs font-medium">
              Aktif
            </option>
            <option value="tidak aktif" className="text-xs font-medium">
              Tidak Aktif
            </option>
          </select>
        </div>
        <div className="flex w-full place-content-end gap-2">
          <button
            type="button"
            onClick={() => {
              closeDialog();
            }}
            className="cursor-pointer rounded bg-red-500 px-3 py-1.5 text-sm font-medium text-white transition-colors duration-300 hover:bg-red-600"
          >
            Batal
          </button>
          <button className="w-[10ch] cursor-pointer rounded bg-green-500 px-3 py-1.5 text-sm font-medium text-white transition-colors duration-300 hover:bg-green-600">
            {loading ? (
              <RefreshCcw className="mx-auto max-h-5 max-w-4 animate-spin" />
            ) : (
              "Simpan"
            )}
          </button>
        </div>
      </form> */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1">
            <h5 className="font-medium">NIK</h5>
            <p>{data?.nik}</p>
          </div>
          <div className="space-y-1">
            <h5 className="font-medium">Nama Lengkap</h5>
            <p>{data?.nama}</p>
          </div>
          <div className="space-y-1">
            <h5 className="font-medium">Unit Kerja</h5>
            <p>{data?.department?.nama}</p>
          </div>
          <div className="space-y-1">
            <h5 className="font-medium">Penugasan</h5>
            <p>{data?.penugasan?.nama}</p>
          </div>
          <div className="space-y-1">
            <h5 className="font-medium">Tempat Lahir</h5>
            <p className="capitalize">
              {data?.tempat_lahir ? data.tempat_lahir.toLowerCase() : "-"}
            </p>
          </div>
          <div className="space-y-1">
            <h5 className="font-medium">Tanggal Lahir</h5>
            <p>
              {data?.tanggal_lahir
                ? new Date(data?.tanggal_lahir).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "-"}
            </p>
          </div>
          <div className="space-y-1">
            <h5 className="font-medium">Jenis Kelamin</h5>
            <p className="capitalize">{data?.jenis_kelamin ?? "-"}</p>
          </div>
          <div className="space-y-1 md:col-span-2 lg:col-span-4">
            <h5 className="font-medium">Alamat</h5>
            <p className="capitalize">{data?.alamat ?? "-"}</p>
          </div>
          <div className="space-y-1">
            <h5 className="font-medium">RT</h5>
            <p className="capitalize">{data?.rt ?? "-"}</p>
          </div>
          <div className="space-y-1">
            <h5 className="font-medium">RW</h5>
            <p className="capitalize">{data?.rw ?? "-"}</p>
          </div>
          <div className="space-y-1">
            <h5 className="font-medium">Kecamatan</h5>
            <p className="capitalize">{data?.nama_kecamatan ?? "-"}</p>
          </div>
          <div className="space-y-1">
            <h5 className="font-medium">Kelurahan</h5>
            <p className="capitalize">{data?.nama_kelurahan ?? "-"}</p>
          </div>
          <div className="space-y-1">
            <h5 className="font-medium">Agama</h5>
            <p className="capitalize">{data?.agama ?? "-"}</p>
          </div>
          <div className="space-y-1">
            <h5 className="font-medium">Status Perkawinan</h5>
            <p className="capitalize">{data?.status_perkawinan ?? "-"}</p>
          </div>
          <div className="space-y-1">
            <h5 className="font-medium">Gol. Darah</h5>
            <p className="capitalize">{data?.gol_darah ?? "-"}</p>
          </div>
          <div className="space-y-1">
            <h5 className="font-medium">Panjang Jalur</h5>
            <p className="capitalize">
              {data?.panjang_jalur ? `${data?.panjang_jalur} M` : "-"}
            </p>
          </div>
          <div className="space-y-1 md:col-span-2 lg:col-span-4">
            <h5 className="font-medium">Rute Kerja</h5>
            <p className="capitalize">{data?.rute_kerja ?? "-"}</p>
          </div>
          <div className="space-y-1 place-self-end md:col-span-2 lg:col-span-4">
            <button
              type="button"
              onClick={() => closeDialog()}
              className="cursor-pointer rounded bg-red-500 px-4 py-1.5 font-medium text-white transition-colors duration-300 hover:bg-red-600"
            >
              Tutup
            </button>
          </div>
        </div>
      </section>
    );
  };

export default memo(FormEdit);
