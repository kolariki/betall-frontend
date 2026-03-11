import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import { Mail, Lock, User, Loader2 } from "lucide-react";
import BetAllLogoRegister from "../components/BetAllLogoRegister";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    setLoading(true);
    try {
      await signUp(email, password, username);
      toast.success("¡Cuenta creada! Revisa tu email para confirmar.");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="min-h-[80vh] flex items-center justify-center relative">
      <div className="fixed inset-0 bg-[url('/bg-hero.jpg')] bg-center bg-cover opacity-20 pointer-events-none" />
      <div className="glass-card p-8 w-full max-w-md relative z-10">
        <div className="flex items-center justify-center mb-4">
          <BetAllLogoRegister className="w-80 h-32" />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-[#848e9c] mb-1.5">
              Nombre de usuario
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-[#5e6673]" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#1e2329] border border-[#2b3139] rounded-lg pl-10 pr-4 py-2.5 text-[#eaecef] text-sm focus:outline-none focus:border-[#FCD535]/50"
                placeholder="tu_username"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-[#848e9c] mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-[#5e6673]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1e2329] border border-[#2b3139] rounded-lg pl-10 pr-4 py-2.5 text-[#eaecef] text-sm focus:outline-none focus:border-[#FCD535]/50"
                placeholder="tu@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-[#848e9c] mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-[#5e6673]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1e2329] border border-[#2b3139] rounded-lg pl-10 pr-4 py-2.5 text-[#eaecef] text-sm focus:outline-none focus:border-[#FCD535]/50"
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Crear Cuenta"
            )}
          </button>
        </form>

        <p className="text-sm text-[#848e9c] text-center mt-6">
          ¿Ya tienes cuenta?{" "}
          <Link
            to="/login"
            className="text-[#FCD535] hover:text-[#FFE066] font-medium"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
