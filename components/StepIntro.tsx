import React from 'react';
import { ArrowRight, Sparkles, Camera } from 'lucide-react';

interface Props {
  onStart: () => void;
}

const StepIntro: React.FC<Props> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8 px-4 animate-in fade-in duration-700">
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-200 to-stone-300 rounded-full blur opacity-30"></div>
        <div className="relative bg-white p-4 rounded-full shadow-sm">
          <Camera className="w-12 h-12 text-stone-700" />
        </div>
      </div>

      <div className="space-y-4 max-w-lg">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-800 leading-tight">
          AI Gợi Ý <span className="text-amber-700">3 Phương Án</span><br/> Thiết Kế Nội Thất
        </h1>
        <p className="text-stone-500 text-lg">
          Bạn đang phân vân về cách bố trí và phong cách? Chụp ảnh không gian, AI sẽ đề xuất giải pháp tối ưu nhất cho bạn.
        </p>
      </div>

      <div className="bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-stone-200 w-full max-w-sm shadow-sm space-y-3">
        <div className="flex items-center gap-3 text-stone-600 text-sm text-left">
          <div className="bg-green-100 p-1.5 rounded-full"><Sparkles className="w-4 h-4 text-green-700" /></div>
          <span>Phân tích hiện trạng không gian</span>
        </div>
        <div className="flex items-center gap-3 text-stone-600 text-sm text-left">
          <div className="bg-blue-100 p-1.5 rounded-full"><Sparkles className="w-4 h-4 text-blue-700" /></div>
          <span>Đề xuất 3 phong cách thiết kế</span>
        </div>
        <div className="flex items-center gap-3 text-stone-600 text-sm text-left">
          <div className="bg-amber-100 p-1.5 rounded-full"><Sparkles className="w-4 h-4 text-amber-700" /></div>
          <span>Dự toán ngân sách sơ bộ</span>
        </div>
      </div>

      <button
        onClick={onStart}
        className="group relative w-full max-w-sm bg-stone-900 text-white py-4 rounded-xl font-medium text-lg shadow-lg hover:bg-stone-800 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
      >
        THỬ MIỄN PHÍ NGAY
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>
      
      <p className="text-xs text-stone-400">Đã có hơn 1,200 chủ nhà sử dụng</p>
    </div>
  );
};

export default StepIntro;
