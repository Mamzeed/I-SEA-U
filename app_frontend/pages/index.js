import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login"); // เปลี่ยนเส้นทางไปที่ /login
  }, [router]);

  return null; // ไม่ต้องแสดงอะไรที่หน้านี้เลย
}
