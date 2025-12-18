import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useLoginForm } from "./hooks/useLoginForm";
import TextField from "./components/TextField";
import PasswordField from "./components/PasswordField";
import logo from "@/assets/img/dlh-logo.webp";

const LoginPage = () => {
  const { data, loading, error, handleChange, handleSubmit } = useLoginForm();

  useEffect(() => {
    document.title = "Login";
  }, []);

  return (
    <section className="z-10 flex w-full flex-1 items-center justify-center space-y-3 bg-[#F9FEFF] p-5 shadow">
      <div className="w-full max-w-lg px-7">
        <div className="text-left lg:hidden mb-4 font-medium space-y-2">
          <img src={logo} alt="logo" className="mx-auto w-full max-w-44" />
          <div className="text-center">
            <h2>Sistem Informasi Geografis Petugas dan TPS</h2>
            <p>SIGET V2</p>
          </div>
        </div>
        <div className="mb-3 text-center lg:space-y-2 lg:text-left">
          {/* <img src={logo} alt="logo" className="mx-auto w-full max-w-44" /> */}
          <h2 className="font-bold md:text-lg lg:text-2xl">
            Selamat Datang Kembali
          </h2>
          <p className="text-xs font-medium md:text-sm">
            Masuk ke akun Anda untuk mengakses sistem
          </p>
        </div>
        {error && (
          <p className="text-center text-xs text-red-500">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="w-full space-y-3">
          <TextField
            label="Username"
            name="username"
            placeholder="Masukkan username..."
            autoComplete="off"
            value={data.username}
            onChange={handleChange}
          />
          <PasswordField
            label="Password"
            name="password"
            placeholder="Masukkan password..."
            autoComplete="off"
            value={data.password}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="w-full cursor-pointer rounded bg-blue-500 py-2.5 text-sm font-medium text-white transition-colors duration-300 hover:bg-blue-600"
          >
            {loading ? (
              <Loader2 className="mx-auto size-5 animate-spin" />
            ) : (
              "Masuk"
            )}
          </button>
          <hr className="my-4" />
          <h3 className="text-center text-sm text-gray-500">
            © 2025 SIKPK DLH Kota Palembang
          </h3>
        </form>
      </div>
    </section>
  );
};

export default LoginPage;
