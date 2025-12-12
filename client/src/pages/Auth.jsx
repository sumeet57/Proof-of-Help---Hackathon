// src/pages/Auth.jsx
import React, { useState, useCallback, useContext } from "react";
import { UserContext } from "../context/UserContext";
import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaSignInAlt,
  FaUserPlus,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

const InputField = ({
  icon: Icon,
  type = "text",
  name,
  id,
  placeholder,
  value,
  onChange,
  ariaLabel,
  required = false,
}) => {
  const [inputType, setInputType] = useState(type);
  const isPassword = type === "password";

  const toggleVisibility = () =>
    setInputType((prev) => (prev === "password" ? "text" : "password"));

  return (
    <div className="relative mb-3">
      <label htmlFor={id} className="sr-only">
        {ariaLabel || placeholder}
      </label>

      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
        <Icon />
      </div>

      <input
        id={id}
        name={name}
        type={inputType}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-label={ariaLabel || placeholder}
        required={required}
        className="w-full pl-11 pr-12 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-orange-400/40 transition"
        inputMode={type === "email" ? "email" : undefined}
      />

      {isPassword && (
        <button
          type="button"
          onClick={toggleVisibility}
          aria-label={
            inputType === "password" ? "Show password" : "Hide password"
          }
          className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-100"
        >
          {inputType === "password" ? <FaEye /> : <FaEyeSlash />}
        </button>
      )}
    </div>
  );
};

const Auth = () => {
  const { register, login, loading } = useContext(UserContext);

  const AUTH = { LOGIN: "login", REGISTER: "register" };
  const [authType, setAuthType] = useState(AUTH.LOGIN);

  const [formData, setFormData] = useState({
    fullName: { firstName: "", lastName: "" },
    email: "",
    password: "",
  });

  const updateValues = useCallback((e) => {
    const { name, id, value } = e.target;
    setFormData((prev) => {
      if (name === "fullName") {
        return { ...prev, fullName: { ...prev.fullName, [id]: value } };
      }
      return { ...prev, [name]: value };
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (authType === AUTH.REGISTER) {
        await register(formData);
      } else {
        const { fullName, ...rest } = formData;
        await login(rest);
      }
    } catch (err) {
      console.error("Auth Error:", err);
    }
  };

  const toggleAuthType = () =>
    setAuthType((prev) => (prev === AUTH.LOGIN ? AUTH.REGISTER : AUTH.LOGIN));

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 p-4">
      <div className="w-full max-w-lg bg-zinc-800/30 border border-zinc-700 rounded-2xl p-6 sm:p-8 shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-100 text-center mb-4">
          {authType === AUTH.LOGIN ? "Sign In" : "Create Account"}
        </h2>
        <p className="text-sm text-stone-400 text-center mb-6">
          {authType === AUTH.LOGIN
            ? "Welcome back — sign in to continue"
            : "Create an account to post and receive help"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          {authType === AUTH.REGISTER && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <InputField
                  icon={FaUser}
                  type="text"
                  name="fullName"
                  id="firstName"
                  placeholder="First name"
                  onChange={updateValues}
                  value={formData.fullName.firstName}
                  ariaLabel="First name"
                  required
                />
              </div>
              <div>
                <InputField
                  icon={FaUser}
                  type="text"
                  name="fullName"
                  id="lastName"
                  placeholder="Last name"
                  onChange={updateValues}
                  value={formData.fullName.lastName}
                  ariaLabel="Last name"
                  required
                />
              </div>
            </div>
          )}

          <InputField
            icon={FaEnvelope}
            type="email"
            name="email"
            id="email"
            placeholder="Email address"
            onChange={updateValues}
            value={formData.email}
            ariaLabel="Email address"
            required
          />

          <InputField
            icon={FaLock}
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            onChange={updateValues}
            value={formData.password}
            ariaLabel="Password"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-zinc-950 font-semibold rounded-lg shadow-md hover:scale-[0.997] transition disabled:opacity-60"
          >
            {authType === AUTH.LOGIN ? <FaSignInAlt /> : <FaUserPlus />}
            <span>
              {loading
                ? "Processing..."
                : authType === AUTH.LOGIN
                ? "Login"
                : "Register"}
            </span>
          </button>
        </form>

        <div className="mt-4 flex items-center justify-between text-sm text-stone-400">
          <button
            type="button"
            onClick={toggleAuthType}
            className="underline-offset-2 hover:underline"
          >
            {authType === AUTH.LOGIN
              ? "Don't have an account? Sign up"
              : "Already have an account? Login"}
          </button>

          <button
            type="button"
            onClick={() => {
              setFormData({
                fullName: { firstName: "", lastName: "" },
                email: "",
                password: "",
              });
            }}
            className="text-stone-400 hover:text-stone-200"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
