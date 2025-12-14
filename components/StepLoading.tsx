import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

const MESSAGES = [
  "Đang tải ảnh lên hệ thống...",
  "AI đang phân tích cấu trúc không gian...",
  "Đang đo lường ánh sáng và diện tích...",
  "Đang phác thảo 3 phương án tối ưu...",
  "Đang tính toán ngân sách dự kiến...",
  "Đang vẽ bản phối cảnh 3D (bước này hơi lâu chút nhé)...",
  "Đang hoàn thiện ánh sáng và vật liệu...",
  "Sắp xong rồi..."
];

const StepLoading: React.FC = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    // Slower interval to account for longer image generation time
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-in fade-in duration-500">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-amber-200 rounded-full blur-xl opacity-20 animate-pulse"></div>
        <Loader2 className="w-16 h-16 text-stone-800 animate-spin relative z-10" />
      </div>
      
      <h3 className="text-xl font-serif font-medium text-stone-800 mb-2 min-h-[3rem]">
        {MESSAGES[currentMessageIndex]}
      </h3>
      
      <div className="w-64 h-2 bg-stone-100 rounded-full overflow-hidden mt-4">
        <div className="h-full bg-stone-800 animate-progress origin-left"></div>
      </div>

      <p className="text-sm text-stone-400 mt-6 max-w-xs">
        Hệ thống đang tạo ra hình ảnh thiết kế độc bản cho bạn. Vui lòng không tắt trình duyệt.
      </p>

      <style>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 20s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default StepLoading;
