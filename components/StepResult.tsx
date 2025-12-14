import React from 'react';
import { AIAnalysisResult, DesignOption, UserFormData } from '../types';
import { Check, Calendar, ChevronRight, Home, Palette, DollarSign, Download, Share2, Phone } from 'lucide-react';

interface Props {
  data: AIAnalysisResult;
  userData: UserFormData;
  onUnlock: () => void;
}

const OptionCard: React.FC<{ option: DesignOption; index: number }> = ({ option, index }) => {
  const isPremium = option.type === 'PREMIUM';
  
  return (
    <div className={`relative bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col h-full group ${isPremium ? 'border-amber-200 ring-1 ring-amber-100' : 'border-stone-100'}`}>
      
      {/* Generated Image Section */}
      <div className="aspect-video w-full bg-stone-100 relative overflow-hidden">
        {option.imageUrl ? (
          <img 
            src={option.imageUrl} 
            alt={option.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
          />
        ) : (
          <div className="flex items-center justify-center h-full text-stone-400 text-sm">
            Đang cập nhật hình ảnh...
          </div>
        )}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 text-xs font-bold tracking-wider text-stone-800 rounded shadow-sm">
          PHƯƠNG ÁN 0{index + 1}
        </div>
        <div className="absolute bottom-3 left-3">
           <span className="px-2 py-1 text-xs font-medium bg-stone-900/80 text-white rounded backdrop-blur-sm">
             {option.type === 'FUNCTIONAL' ? 'Tối ưu công năng' : option.type === 'AESTHETIC' ? 'Thẩm mỹ cảm xúc' : 'Cao cấp bền vững'}
           </span>
        </div>
      </div>

      <div className="p-5 flex-grow space-y-4">
        <h3 className={`text-lg font-serif font-bold ${isPremium ? 'text-amber-900' : 'text-stone-800'}`}>
          {option.title}
        </h3>
        
        <p className="text-sm text-stone-600 leading-relaxed">
          {option.description}
        </p>
        
        <div className="space-y-3 pt-2">
           <div className="flex items-center gap-2 text-sm text-stone-900 font-semibold bg-stone-50 p-2 rounded-lg border border-stone-100">
              <DollarSign size={16} className="text-green-600" />
              <span>{option.estimatedCost}</span>
           </div>
           
           <div className="space-y-2">
             {option.keyFeatures.map((feature, idx) => (
               <div key={idx} className="flex items-start gap-2 text-sm text-stone-600">
                  <Check size={14} className="mt-1 text-amber-600 shrink-0" /> 
                  <span>{feature}</span>
               </div>
             ))}
           </div>
        </div>
      </div>

      <div className="p-4 bg-stone-50 mt-auto border-t border-stone-100 flex gap-3">
        <a 
          href="tel:0967417574"
          className="flex-1 py-2.5 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-700 transition-colors shadow-sm flex items-center justify-center gap-2 no-underline"
        >
          <Phone size={14} /> Đặt lịch tư vấn
        </a>
      </div>
    </div>
  );
};

const StepResult: React.FC<Props> = ({ data, userData, onUnlock }) => {
  return (
    <div className="max-w-6xl mx-auto pb-24 animate-in fade-in duration-700">
      
      {/* Header Analysis */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8 mb-10 shadow-sm">
        <div className="flex flex-col md:flex-row gap-8 items-start">
           <div className="w-full md:w-1/3 space-y-2">
              <div className="aspect-video bg-stone-100 rounded-lg overflow-hidden border border-stone-200 shadow-inner">
                {userData.imagePreviewUrl && (
                  <img src={userData.imagePreviewUrl} alt="Original Space" className="w-full h-full object-cover" />
                )}
              </div>
              <p className="text-xs text-center text-stone-400 font-medium uppercase tracking-widest">Ảnh hiện trạng</p>
           </div>
           
           <div className="flex-1 space-y-4">
             <div className="flex items-center gap-2 text-amber-600 mb-1">
                <Home size={20} />
                <span className="text-sm font-bold tracking-wide uppercase">Góc nhìn chuyên gia AI</span>
             </div>
             <p className="text-lg md:text-xl font-serif leading-relaxed text-stone-800">
               "{data.currentSpaceAnalysis}"
             </p>
             <div className="flex flex-wrap gap-2 pt-2">
               <div className="bg-stone-100 px-3 py-1 rounded-full text-xs font-medium text-stone-600">
                 {userData.roomType}
               </div>
                <div className="bg-stone-100 px-3 py-1 rounded-full text-xs font-medium text-stone-600">
                 {userData.style}
               </div>
               <div className="bg-stone-100 px-3 py-1 rounded-full text-xs font-medium text-stone-600">
                 {userData.budget}
               </div>
             </div>
           </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-end mb-8 px-2 gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-stone-900">3 Giải Pháp Thiết Kế</h2>
          <p className="text-stone-500 mt-2">Được AI tạo riêng cho không gian của bạn</p>
        </div>
        <button className="text-stone-500 text-sm font-medium hover:text-stone-900 flex items-center gap-2">
          <Share2 size={16} /> Chia sẻ kết quả
        </button>
      </div>

      {/* 3 Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-2 mb-12">
        {data.options.map((opt, idx) => (
          <OptionCard key={idx} option={opt} index={idx} />
        ))}
      </div>

      {/* Footer Info */}
      <div className="text-center bg-amber-50 rounded-xl p-8 border border-amber-100">
        <h4 className="font-serif font-bold text-lg text-amber-900 mb-2">Bạn ưng ý với các đề xuất này?</h4>
        <p className="text-amber-800/80 mb-6 max-w-lg mx-auto">
          Hình ảnh trên là phác thảo ý tưởng từ AI. Để hiện thực hóa ngôi nhà trong mơ, hãy gặp gỡ KTS của chúng tôi để được tư vấn chi tiết kỹ thuật.
        </p>
        <a 
          href="tel:0967417574"
          className="inline-block bg-stone-900 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:bg-stone-800 hover:shadow-xl transition-all no-underline"
        >
          Liên hệ KTS: 0967.417.574
        </a>
      </div>
      
    </div>
  );
};

export default StepResult;