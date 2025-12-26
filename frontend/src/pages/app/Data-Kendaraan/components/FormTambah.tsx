// import { useDialog } from "@/hooks/useDialog";
// import {
//   initialState,
//   type FormState,
//   type FotoState,
//   type KendaraanRes,
// } from "../__types";
// import { useJenisKendaraan } from "@/hooks/useJenisKendaraan";
// import { usePetugasFilter } from "@/hooks/usePetugasFilter";
// import type { ValidationErrors } from "@/types/error.types";
// import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";

const FormTambah = () => {
//   const { isOpen, data, closeDialog } = useDialog<KendaraanRes>();

//   const { jenisKendaraan, loading: loadingJk } = useJenisKendaraan();
//   const { petugas, loading: loadingPetugas } = usePetugasFilter();

//   const [formData, setFormData] = useState<FormState>(initialState);
//   const [foto, setFoto] = useState<FotoState>({
//     foto_depan: null,
//     foto_belakang: null,
//     foto_kanan: null,
//     foto_kiri,
//   });
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState<ValidationErrors>({});

//   const fotoDepanRef = useRef<HTMLInputElement>(null);
//   const fotoBelakangRef = useRef<HTMLInputElement>(null);
//   const fotoKananRef = useRef<HTMLInputElement>(null);
//   const fotoKiriRef = useRef<HTMLInputElement>(null);

//   const resetFileInputs = () => {
//     if (fotoDepanRef.current) fotoDepanRef.current.value = "";
//     if (fotoBelakangRef.current) fotoBelakangRef.current.value = "";
//     if (fotoKananRef.current) fotoKananRef.current.value = "";
//     if (fotoKiriRef.current) fotoKiriRef.current.value = "";

//     setFoto({
//       foto_depan: null,
//       foto_belakang: null,
//       foto_kanan: null,
//       foto_kiri: null,
//     });
//   };

//   useEffect(() => {
//     if (!isOpen || !data?.id) return;

//     setFormData((prev) => ({
//       ...prev,
//       ...initialState,
//       ...data,
//       foto_kendaraan: "",
//     }));

//     setErrors({});
//     resetFileInputs();
//   }, [isOpen, data]);

//   const handleChange = (
//     e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
//   ) => {
//     e.preventDefault();

//     const { name, value } = e.target;

//     if (name === "tahun_pembuatan") {
//       const digitOnly = value.replace(/\D+/g, "");
//       setFormData((prev) => ({ ...prev, tahun_pembuatan: digitOnly }));
//       return;
//     }

//     setFormData((prev) => ({
//       ...prev,
//       ...(name === "id_jenis" ||
//       name === " id_department" ||
//       name === "id_petugas"
//         ? { [name]: value ? Number(value) : null }
//         : { [name]: value }),
//     }));
//   };

//   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, files } = e.target;
//     if (!files?.length) return;

//     setFoto((prev) => ({
//       ...prev,
//       [name]: files[0],
//     }));
//   };

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//   }

  return <div>FormTambah</div>;
};

export default FormTambah;
