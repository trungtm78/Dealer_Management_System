import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h2 className="text-2xl font-bold mb-4">404 - Không tìm thấy trang</h2>
      <p className="text-gray-600 mb-6">Trang bạn đang tìm kiếm không tồn tại.</p>
      <Link href="/login" passHref>
        <Button className="bg-[#E60012] hover:bg-[#C50010] text-white">
          Quay lại trang Đăng nhập
        </Button>
      </Link>
    </div>
  );
}
