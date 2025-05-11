import React, { useState } from "react";
import { useRouter } from "next/router";

export default function Signup() {
  const router = useRouter(); // ✅ ใช้ router สำหรับการเปลี่ยนหน้า
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    fullname: "",
    address: "",
    province: "",
    post_code: "",
    tel: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // reset any previous error

    // Check if password and confirm password match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    // Prepare the data to send
    const data = {
      email: formData.email,
      username: formData.username,
      password: formData.password,
      fullname: formData.fullname,
      address: formData.address,
      province: formData.province,
      post_code: formData.post_code,
      tel: formData.tel,
    };

    try {
      const response = await fetch("http://127.0.0.1:3342/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Registration successful!");
        router.push("/home");
      } else {
        setError(result.error || "Something went wrong!");
      }
    } catch (error) {
      setError("Something went wrong!");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-orange-50 text-center">
      <img src="/logoiseau_b.png" alt="Logo" className="w-72 mb-1" />
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="E-mail"
          className="mb-3 px-4 py-2 w-full bg-white text-black rounded-lg outline-none shadow-lg"
        />
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
          className="mb-3 px-4 py-2 w-full bg-white text-black rounded-lg outline-none shadow-lg"
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="mb-3 px-4 py-2 w-full bg-white text-black rounded-lg outline-none shadow-lg"
        />
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
          className="mb-5 px-4 py-2 w-full bg-white text-black rounded-lg outline-none shadow-lg"
        />
        <input
          type="text"
          name="fullname"
          value={formData.fullname}
          onChange={handleChange}
          placeholder="Full Name"
          className="mb-3 px-4 py-2 w-full bg-white text-black rounded-lg outline-none shadow-lg"
        />
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
          className="mb-3 px-4 py-2 w-full bg-white text-black rounded-lg outline-none shadow-lg"
        />
        <input
          type="text"
          name="province"
          value={formData.province}
          onChange={handleChange}
          placeholder="Province"
          className="mb-3 px-4 py-2 w-full bg-white text-black rounded-lg outline-none shadow-lg"
        />
        <input
          type="text"
          name="post_code"
          value={formData.post_code}
          onChange={handleChange}
          placeholder="Post Code"
          className="mb-3 px-4 py-2 w-full bg-white text-black rounded-lg outline-none shadow-lg"
        />
        <input
          type="text"
          name="tel"
          value={formData.tel}
          onChange={handleChange}
          placeholder="Telephone"
          className="mb-5 px-4 py-2 w-full bg-white text-black rounded-lg outline-none shadow-lg"
        />
        {error && <p className="text-red-500">{error}</p>}
        <button 
          type="submit"
          className="w-full py-2 bg-emerald-600 text-white font-bold rounded-lg shadow-lg transition duration-300 ease-in-out hover:scale-105 hover:-translate-y-1"
        >
          Create Account
        </button>
      </form>
    </main>
  );
}
