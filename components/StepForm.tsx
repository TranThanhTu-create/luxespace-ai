import React, { useState, useRef } from 'react';
import { UserFormData, DesignStyle, BudgetRange, RoomType } from '../types';
import { Upload, X, Image as ImageIcon, Sparkles } from 'lucide-react';

interface Props {
  userData: UserFormData;
  setUserData: React.Dispatch<React.SetStateAction<UserFormData>>;
  onSubmit: () => void;
}

const StepForm: React.FC<Props> = ({ userData, setUserData, onSubmit }) => {
  const [errors, setErrors] = useState<Partial<Record<keyof UserFormData, string>>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof UserFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setUserData(prev => ({ ...prev, imageFile: file, imagePreviewUrl: url }));
      setErrors(prev => ({ ...prev, imageFile: undefined }));
    }
  };

  const removeImage = () => {
    setUserData(prev => ({ ...prev, imageFile: null, imagePreviewUrl: null }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof UserFormData, string>> = {};
    if (!userData.name) newErrors.name = "Vui lòng nhập họ tên";
    if (!userData.phone) newErrors.phone = "Vui lòng nhập số điện thoại";
    if (!userData.email) newErrors.email = "Vui lòng nhập email";
    if (!userData.imageFile) newErrors.imageFile = "Vui lòng chụp/tải lên ảnh không gian";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit();
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-sm border border-stone-100 p-6 animate-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-serif font-bold text-stone-800 mb-6 text-center">Thông tin khảo sát</h2>

      <div className="space-y-5">
        
        {/* Image Upload - First Priority */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Hình ảnh không gian hiện tại <span className="text-red-500">*</span></label>
          <div 
            className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer hover:bg-stone-50 ${errors.imageFile ? 'border-red-300 bg-red-50' : 'border-stone-300'}`}
            onClick={() => !userData.imageFile && fileInputRef.current?.click()}
          >
             <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange}
            />
            
            {userData.imagePreviewUrl ? (
              <div className="relative w-full h-48 rounded-lg overflow-hidden">
                <img src={userData.imagePreviewUrl} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  onClick={(e) => { e.stopPropagation(); removeImage(); }}
                  className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="bg-stone-100 p-3 rounded-full">
                  <Upload className="w-6 h-6 text-stone-500" />
                </div>
                <p className="text-sm font-medium text-stone-600">Chạm để tải ảnh hoặc chụp</p>
                <p className="text-xs text-stone-400">Ảnh sáng rõ giúp AI phân tích tốt hơn</p>
              </div>
            )}
          </div>
          {errors.imageFile && <p className="text-red-500 text-xs mt-1">{errors.imageFile}</p>}
        </div>

        {/* Personal Info */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Họ và tên <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              name="name"
              value={userData.name}
              onChange={handleInputChange}
              className={`w-full p-3 bg-stone-50 border rounded-lg focus:ring-1 focus:ring-stone-800 outline-none transition-all ${errors.name ? 'border-red-300' : 'border-stone-200'}`}
              placeholder="Nguyễn Văn A"
            />
             {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Số điện thoại <span className="text-red-500">*</span></label>
              <input 
                type="tel" 
                name="phone"
                value={userData.phone}
                onChange={handleInputChange}
                className={`w-full p-3 bg-stone-50 border rounded-lg focus:ring-1 focus:ring-stone-800 outline-none transition-all ${errors.phone ? 'border-red-300' : 'border-stone-200'}`}
                placeholder="09xxx"
              />
               {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
             <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Email <span className="text-red-500">*</span></label>
              <input 
                type="email" 
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                className={`w-full p-3 bg-stone-50 border rounded-lg focus:ring-1 focus:ring-stone-800 outline-none transition-all ${errors.email ? 'border-red-300' : 'border-stone-200'}`}
                placeholder="email@example.com"
              />
               {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
          </div>
        </div>

        {/* Design Preferences */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-stone-100">
           <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Loại không gian</label>
            <select name="roomType" value={userData.roomType} onChange={handleInputChange} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg outline-none">
              {Object.values(RoomType).map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>

           <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Phong cách mong muốn</label>
            <select name="style" value={userData.style} onChange={handleInputChange} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg outline-none">
              {Object.values(DesignStyle).map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Ngân sách dự kiến</label>
            <select name="budget" value={userData.budget} onChange={handleInputChange} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg outline-none">
              {Object.values(BudgetRange).map(v => <option key={v} value={v}>{v}</option>)}
            </select>
        </div>

        <div>
           <label className="block text-sm font-medium text-stone-700 mb-1">Ghi chú thêm (Tùy chọn)</label>
           <textarea 
             name="note" 
             value={userData.note}
             onChange={handleInputChange}
             className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg outline-none h-20 resize-none"
             placeholder="Ví dụ: Tôi thích màu sáng, nhà có trẻ con..."
           />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-stone-900 text-white py-4 rounded-xl font-medium text-lg shadow-lg hover:bg-stone-800 transition-all flex items-center justify-center gap-2 mt-4"
        >
          <Sparkles className="w-5 h-5 text-amber-200" />
          AI PHÂN TÍCH & ĐỀ XUẤT
        </button>
      </div>
    </div>
  );
};

export default StepForm;