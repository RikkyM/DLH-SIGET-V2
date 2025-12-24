import { useDialog } from "@/hooks/useDialog";
import { http } from "@/services/http";
import type { Penugasan } from "@/types/master-data.types";
import axios from "axios";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

type State = {
  nama: string;
};

type ValidationErrors = Record<string, string[]>;

type ApiError = {
  message?: string;
  errors?: ValidationErrors;
};

const FormEdit = ({ refetch }: { refetch: () => void }) => {
  const { isOpen, data, closeDialog } = useDialog<Penugasan>();

  const [formData, setFormData] = useState<State>({
    nama: "",
  });
  const [icon, setIcon] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const iconRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isOpen || !data?.id) return;

    setFormData({
      nama: data?.nama ?? "",
    });

    setErrors({});
    if (iconRef.current) iconRef.current.value = "";
  }, [isOpen, data]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!data?.id) return;

    const fd = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value === null || value === "") return;
      fd.append(key, String(value));
    });

    if (icon) {
      fd.append("icon", icon);
    }

    setLoading(true);

    try {
      fd.append("_method", "PUT");
      const res = await http.post(`/api/penugasan/${data.id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log(res.data, icon);

      refetch();
      setIcon(null);
      if (iconRef.current) iconRef.current.value = "";
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
      className={`max-h-full w-full max-w-xl space-y-3 overflow-auto rounded-sm bg-white p-3 shadow transition-all duration-300 ${
        isOpen ? "scale-100" : "scale-95"
      }`}
    >
      <h2 className="font-semibold lg:text-lg">Edit Penugasan</h2>
      <form
        onSubmit={handleSubmit}
        className="grid gap-5"
        encType="multipart/form-data"
      >
        <div className="space-y-1 text-sm">
          <label htmlFor="nama_penugasan" className="block font-medium">
            Nama Penugasan
          </label>
          <input
            className="w-full rounded border border-gray-300 bg-transparent px-3 py-1.5 focus:ring focus:ring-blue-400 focus:outline-none"
            type="text"
            id="nama_penugasan"
            name="nama"
            placeholder="Masukkan nama TPS..."
            value={formData?.nama || ""}
            onChange={handleChange}
          />
          {fieldError("nama") && (
            <p className="text-xs text-red-600">{fieldError("nama")}</p>
          )}
        </div>
        <div className="space-y-1 text-sm">
          <label htmlFor="icon" className="block font-medium">
            Icon
          </label>
          <input
            className="w-full cursor-pointer rounded border border-gray-300 bg-transparent px-3 py-1.5 focus:ring focus:ring-blue-400 focus:outline-none"
            ref={iconRef}
            type="file"
            id="icon"
            name="icon"
            placeholder="Masukkan nama TPS..."
            accept="image/*"
            // value={formData?.icon || ""}
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;

              setIcon(file);
            }}
          />
          {fieldError("icon") && (
            <p className="text-xs text-red-600">{fieldError("icon")}</p>
          )}
          {data?.icon && (
            <a
              href={`${import.meta.env.VITE_API_BASE}/api/penugasan/${data.id}/icon?v=${encodeURIComponent(data.updated_at ?? "")}`}
              target="_blank"
              rel="noreferrer noopener"
              className="hover:underline"
            >
              Lihat Icon
            </a>
          )}
        </div>
        <div className="flex items-center gap-2 place-self-end">
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

export default FormEdit;
