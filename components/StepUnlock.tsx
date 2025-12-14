import React from 'react';
import { CheckCircle2, Phone, Mail, CalendarCheck } from 'lucide-react';
import { UserFormData } from '../types';

interface Props {
  userData: UserFormData;
}

const StepUnlock: React.FC<Props> = ({ userData }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 animate-in zoom-in duration-500">
      <div className="bg-green-100 p-4 rounded-full mb-6">
        <CalendarCheck className="w-12 h-12 text-green-600" />
      </div>
      
      <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-800 mb-4">
        Đã đăng ký tư vấn thành công!
      </h2>
      
      <div className="bg-white p-6 rounded-xl border border-stone-100 shadow-sm max-w-md w-full mb-8">
        <p className="text-stone-600 mb-4">
          Cảm ơn bạn đã lưu lại 3 phương án thiết kế. Kiến trúc sư của LuxeSpace sẽ liên hệ với bạn trong vòng 24h qua:
        </p>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 bg-stone-50 p-3 rounded-lg">
            <Mail className="text-stone-400 w-5 h-5" />
            <span className="text-stone-800 font-medium">{userData.email}</span>
          </div>
           <div className="flex items-center gap-3 bg-stone-50 p-3 rounded-lg">
            <Phone className="text-stone-400 w-5 h-5" />
            <span className="text-stone-800 font-medium">{userData.phone}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <button 
            onClick={() => window.location.reload()}
            className="text-stone-500 text-sm font-medium hover:text-stone-900 underline underline-offset-4"
        >
            Tạo thiết kế cho phòng khác
        </button>
      </div>
    </div>
  );
};

export default StepUnlock;
