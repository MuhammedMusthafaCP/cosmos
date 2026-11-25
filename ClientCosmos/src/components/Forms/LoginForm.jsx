import { useState } from "react";
import LOGINBG from "../../Assets/LOGINBG1.png";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AlertCircle, Loader2 } from "lucide-react";
import GOOGLE from "../../Assets/GOOGLE.png";
import { API_URL } from "../../config";

const EMAIL_PATTERN = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

function LoginForm() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    setApiError(null);
    try {
      const response = await axios.post(`${API_URL}/users/getone`, data, {
        withCredentials: true,
      });
      if (response.status === 201) {
        navigate("/HomePage");
      }
    } catch (error) {
      console.error("Error in post request", error);
      setApiError(error.response?.data?.error || "Unable to log in. Please try again.");
    }
  };

  const toLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-black bg-cover bg-center bg-no-repeat px-4 py-10"
      style={{ backgroundImage: `url(${LOGINBG})` }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="w-full max-w-md rounded-3xl border border-white/10 bg-black/65 p-6 text-white shadow-2xl backdrop-blur-xl sm:p-10"
      >
        <Link to="/HomePage" className="font-poppins text-sm font-bold tracking-[0.25em] text-sky-300">COSMOS</Link>
        <h1 className="mt-4 font-poppins text-3xl font-bold">Welcome back</h1>

        {apiError && (
          <div
            role="alert"
            className="mt-4 flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{apiError}</span>
          </div>
        )}

        <div className="mt-6">
          <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium text-gray-300">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="d-input"
            aria-invalid={errors.email ? "true" : "false"}
            {...register("email", {
              required: "Email is required",
              pattern: { value: EMAIL_PATTERN, message: "Invalid email" },
            })}
          />
          {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
        </div>

        <div className="mt-5">
          <label htmlFor="login-password" className="mb-1.5 block text-sm font-medium text-gray-300">
            Password
          </label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            placeholder="Password"
            className="d-input"
            aria-invalid={errors.password ? "true" : "false"}
            {...register("password", {
              required: "Password is required",
              minLength: { value: 4, message: "Minimum length is 4 characters" },
              maxLength: { value: 20, message: "Maximum length is 20 characters" },
            })}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
          )}
        </div>

        <button type="submit" disabled={isSubmitting} className="d-btn-primary mt-6 w-full py-2.5">
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Login
        </button>

        <div className="my-6 flex items-center gap-3 text-xs text-gray-500">
          <span className="h-px flex-1 bg-white/15" />
          OR
          <span className="h-px flex-1 bg-white/15" />
        </div>

        <button type="button" onClick={toLogin} className="d-btn w-full gap-3 py-2.5">
          <img src={GOOGLE} alt="" className="h-5 w-5 object-contain" />
          Login with Google
        </button>

        <p className="mt-6 text-center text-sm text-gray-400">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="font-semibold text-white underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}

export default LoginForm;
