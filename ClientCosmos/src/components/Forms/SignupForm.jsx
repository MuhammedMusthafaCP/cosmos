import { useState } from "react";
import SIGNUPBG from "../../Assets/LOGINBG4.jpg";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AlertCircle, Loader2 } from "lucide-react";
import GOOGLE from "../../Assets/GOOGLE.png";
import { API_URL } from "../../config";

const EMAIL_PATTERN = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

function SignupForm() {
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
      const response = await axios.post(`${API_URL}/users`, data, {
        withCredentials: true,
      });
      if (response.status === 201) {
        navigate("/HomePage");
      }
    } catch (error) {
      console.error("Error in post request", error);
      setApiError(error.response?.data?.error || "Unable to sign up. Please try again.");
    }
  };

  const googleSignUp = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-black bg-cover bg-center bg-no-repeat px-4 py-10"
      style={{
        backgroundImage: `url(${SIGNUPBG})`,
      }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="w-full max-w-md rounded-3xl border border-white/10 bg-black/65 p-6 text-white shadow-2xl backdrop-blur-xl sm:p-10"
      >
        <h1 className="font-poppins text-3xl font-bold uppercase">Create an account</h1>

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
          <label htmlFor="signup-name" className="mb-1.5 block text-sm font-medium text-gray-300">
            Name
          </label>
          <input
            id="signup-name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            className="d-input"
            aria-invalid={errors.name ? "true" : "false"}
            {...register("name", {
              required: "Name is required",
              minLength: { value: 5, message: "Minimum length is 5 characters" },
              maxLength: { value: 20, message: "Maximum length is 20 characters" },
            })}
          />
          {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
        </div>

        <div className="mt-5">
          <label htmlFor="signup-email" className="mb-1.5 block text-sm font-medium text-gray-300">
            Email
          </label>
          <input
            id="signup-email"
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
          <label htmlFor="signup-password" className="mb-1.5 block text-sm font-medium text-gray-300">
            Password
          </label>
          <input
            id="signup-password"
            type="password"
            autoComplete="new-password"
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
          Sign up
        </button>

        <div className="my-6 flex items-center gap-3 text-xs text-gray-500">
          <span className="h-px flex-1 bg-white/15" />
          OR
          <span className="h-px flex-1 bg-white/15" />
        </div>

        <button type="button" onClick={googleSignUp} className="d-btn w-full gap-3 py-2.5">
          <img src={GOOGLE} alt="" className="h-5 w-5 object-contain" />
          Sign up with Google
        </button>

        <p className="mt-6 text-center text-sm text-gray-400">
          Have an account?{" "}
          <Link to="/login" className="font-semibold text-white underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}

export default SignupForm;
