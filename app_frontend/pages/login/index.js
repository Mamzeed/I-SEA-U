import { useEffect, useState } from 'react';

export default function LoginPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // ให้แสดงฟอร์มหลังจากโหลด client แล้วเท่านั้น
  }, []);

  async function onLogin(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const response = await fetch('http://127.0.0.1:3342/api/token/', {
      method: 'POST',
      body: formData,
    });

    try {
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('jwt_access', data.access);
        alert("Login success!");
        window.location.href = '/home';
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      alert("Your username/password are incorrect!");
    }
  }

  // รอให้โหลด client ก่อนถึงค่อยแสดง UI
  if (!isClient) return null;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-orange-50 text-center">
      <img src="/logoiseau_b.png" alt="Logo" className="w-72 mb-1" />
      <form onSubmit={onLogin} className="flex flex-col items-center">
        <label htmlFor="username" className="sr-only">Username</label>
        <input
          id="username"
          type="text"
          name="username"
          placeholder="username"
          required
          className="mb-3 px-4 py-2 w-80 bg-white text-black rounded-lg outline-none shadow-lg transition duration-300 ease-in-out hover:scale-105 hover:-translate-y-1"
        />
        <label htmlFor="password" className="sr-only">Password</label>
        <input
          type="password"
          name="password"
          placeholder="password"
          required
          className="mb-5 px-4 py-2 w-80 bg-white text-black rounded-lg outline-none shadow-lg transition duration-300 ease-in-out hover:scale-105 hover:-translate-y-1"
        />
        <button
          type="submit"
          className="w-80 py-2 mb-2 relative bg-[#40A2E3] text-white font-bold rounded-lg shadow-lg transition duration-300 ease-in-out hover:scale-105 hover:-translate-y-1"
        >
          Login
        </button>
      </form>
      <div className="text-gray-500 mb-2">or</div>
      <a href="/signup">
        <button className="w-80 py-2 bg-emerald-600 text-white font-bold rounded-lg shadow-lg transition duration-300 ease-in-out hover:scale-105 hover:-translate-y-1">
          Sign up
        </button>
      </a>
    </main>
  );
}
