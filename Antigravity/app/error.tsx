"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h2 className="text-2xl font-bold mb-4">Đã xảy ra lỗi!</h2>
      <p className="text-gray-600 mb-6">{error.message || "Không thể tải trang này."}</p>
      <Button
        onClick={() => reset()}
        className="bg-[#E60012] hover:bg-[#C50010] text-white"
      >
        Thử lại
      </Button>
    </div>
  );
}
