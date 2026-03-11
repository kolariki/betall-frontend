import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import { Mail, Lock, Loader2 } from "lucide-react";
import BetAllLogoLogin from "../components/BetAllLogoLogin";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      toast.success("¡Bienvenido de vuelta!");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

    return (
    <div className="min-h-[80vh] flex items-center justify-center relative">
      <div className="fixed inset-0 bg-[url('/bg-hero.jpg')] bg-center bg-cover opacity-20 pointer-events-none" />
      <div className="glass-card p-8 w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex items-center justify-center mb-4">
          <BetAllLogoLogin className="w-80 h-32" />
        </div>
{/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-[#848e9c] mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-[#5e6673]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1e2329] border border-[#2b3139] rounded-lg pl-10 pr-4 py-2.5 text-[#eaecef] text-sm focus:outline-none focus:border-[#00b8d4]/50"
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
                className="w-full bg-[#1e2329] border border-[#2b3139] rounded-lg pl-10 pr-4 py-2.5 text-[#eaecef] text-sm focus:outline-none focus:border-[#00b8d4]/50"
                placeholder="••••••••"
                required
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
              "Iniciar Sesión"
            )}
          </button>
        </form>

        <p className="text-sm text-[#848e9c] text-center mt-6">
          ¿No tienes cuenta?{" "}
          <Link
            to="/register"
            className="text-[#00b8d4] hover:text-[#00e5ff] font-medium"
          >
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
