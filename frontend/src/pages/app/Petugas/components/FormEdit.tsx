import { useDialog } from "@/hooks/useDialog";
import { memo, useEffect, useState, type FormEvent } from "react";
import { RefreshCcw } from "lucide-react";
import type { PetugasForm, PetugasRes } from "../__types";
import { http } from "@/services/http";
import axios from "axios";

const FormEdit = ({ refetch = () => {} }: { refetch?: () => void }) => {
  const { isOpen, data, closeDialog } = useDialog<PetugasRes>();

  const [formData, setFormData] = useState<PetugasForm>({
    nama: "",
    status: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !data) return;

    setFormData({
      nama: data?.nama || "",
      status: data?.status || "",
    });
  }, [data, isOpen]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!data?.id) return;

    setLoading(true);

    try {
      const res = await http.put(`/api/petugas/${data.id}`, formData);

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
      setLoading(false);
    }
  };

  return (
    <section
      onClick={(e) => e.stopPropagation()}
      className={`w-full max-w-xl space-y-3 rounded-sm bg-white p-3 shadow transition-all duration-300 ${
        isOpen ? "scale-100" : "scale-95"
      }`}
    >
      <h2 className="font-semibold lg:text-lg">Edit Jenis Kendaraan</h2>
      <form onSubmit={handleSubmit} className="w-full space-y-2">
        <div className="space-y-1 text-sm">
          <label htmlFor="nama" className="block font-medium">
            Nama Jenis Kendaraan
          </label>
          <input
            className="w-full rounded border border-gray-300 bg-transparent px-3 py-1.5"
            type="text"
            id="nama"
            name="nama"
            placeholder="Masukkan nama unit kerja..."
            value={formData?.nama || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, nama: e.target.value }))
            }
          />
          {/* {error.nama && (
            <p className="text-xs text-red-500">{error.nama[0]}</p>
          )} */}
        </div>
        <div className="space-y-1 text-sm">
          <label htmlFor="status" className="block font-medium">
            Status
          </label>
          <select
            name="status"
            id="status"
            className="w-full cursor-pointer appearance-none rounded border border-gray-300 bg-transparent px-3 py-1.5"
            value={formData?.status ?? ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, status: e.target.value }))
            }
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
      </form>
    </section>
  );
};

export default memo(FormEdit);
