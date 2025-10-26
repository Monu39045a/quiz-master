import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TextInput from "../components/TextInput";
import { useDispatch } from "react-redux";
import { login } from "../redux/userSlice";
import { LOGIN_URL } from "../types/common";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [role, setRole] = useState<"trainer" | "participant">("participant");
  const [form, setForm] = useState({ user_id: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(LOGIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: form.user_id,
          password: form.password,
          role: role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Login failed");
      }

      console.log("Login successful:", data);
      // Dispatch login action
      // const user_role =
      //   data.user.is_trainer == true ? "trainer" : "participant";
      const user_role: "trainer" | "participant" = data.user.is_trainer
        ? "trainer"
        : "participant";
      // dispatch(
      //   login({
      //     user_id: data.user.user_id,
      //     name: data.user.name,
      //     email: data.user.email,
      //     isLoggedIn: true,
      //     role: user_role,
      //   })
      // );

      const userData = {
        user_id: data.user.user_id,
        name: data.user.full_name,
        email: data.user.email,
        isLoggedIn: true,
        role: user_role,
      };

      // Update Redux state
      dispatch(login(userData));

      // Save full user data + token in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(userData));

      navigate("/dashboard");
      if (role === "trainer") {
        console.log("Navigating to trainer dashboard");
        navigate("/dashboard/trainer");
      } else if (role === "participant") {
        navigate("/dashboard/participant");
      }
      console.log("Login attempt:", { ...form, role });
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white/90 backdrop-blur-md p-10 rounded-3xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Quiz App Login
        </h2>

        <div className="flex justify-center gap-4 mb-6">
          {["participant", "trainer"].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r as "trainer" | "participant")}
              className={`px-5 py-2 rounded-full font-medium transition ${
                role === r
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <TextInput
            label="Standard ID"
            name="user_id"
            value={form.user_id}
            onChange={handleChange}
            placeholder="Enter your Standard ID"
          />
          <TextInput
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
          {error && <p className="text-red-500 text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-md"
          >
            {loading ? "Logging in..." : `Login as ${role}`}
          </button>

          <p className="text-center text-gray-600 mt-4">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-indigo-600 font-semibold hover:underline cursor-pointer"
            >
              Register
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
