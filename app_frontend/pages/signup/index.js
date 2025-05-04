import { useState } from "react";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [address, setAddress] = useState("");
  const [province, setProvince] = useState("");
  const [postCode, setPostCode] = useState("");
  const [tel, setTel] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // เช็คว่ารหัสผ่านและยืนยันรหัสผ่านตรงกันหรือไม่
    if (password !== confirmPassword) {
      setErrorMessage("Password and confirm password do not match!");
      return;
    }

    const userData = {
      email,
      username,
      password,
      confirmPassword,
      fullname,
      address,
      province,
      post_code: postCode,
      tel,
    };

    try {
      const response = await fetch("/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        // ถ้าสมัครสมาชิกสำเร็จ
        alert("Account created successfully!");
        // เปลี่ยนหน้าไปที่หน้าอื่น เช่น หน้า Home
        window.location.href = "/home";
      } else {
        // ถ้ามีข้อผิดพลาดจาก backend
        setErrorMessage(data.error || "Something went wrong!");
      }
    } catch (error) {
      setErrorMessage("Something went wrong!");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-orange-50 text-center">
      <img src="/logoiseau_b.png" alt="Logo" className="w-72 mb-1" />
      <input
        type="email"
        placeholder="E-mail"
        className="mb-3 px-4 py-2 w-80 bg-white text-black rounded-lg outline-none shadow-lg"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        placeholder="Username"
        className="mb-3 px-4 py-2 w-80 bg-white text-black rounded-lg outline-none shadow-lg"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="mb-3 px-4 py-2 w-80 bg-white text-black rounded-lg outline-none shadow-lg"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm Password"
        className="mb-5 px-4 py-2 w-80 bg-white text-black rounded-lg outline-none shadow-lg"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      {errorMessage && (
        <p className="text-red-500 mb-3">{errorMessage}</p>
      )}
      <button
        onClick={handleSubmit}
        className="w-80 py-2 bg-emerald-600 text-white font-bold rounded-lg shadow-lg transition duration-300 ease-in-out hover:scale-105 hover:-translate-y-1"
      >
        Create Account
      </button>
    </main>
  );
}
