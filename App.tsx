import React, { useState } from 'react';
import { AppStep, UserFormData, DesignStyle, BudgetRange, RoomType, AIAnalysisResult } from './types';
import StepIntro from './components/StepIntro';
import StepForm from './components/StepForm';
import StepLoading from './components/StepLoading';
import StepResult from './components/StepResult';
import StepUnlock from './components/StepUnlock';
import { analyzeSpaceWithGemini } from './services/geminiService';
import { saveLeadToSheet } from './services/googleSheetService';
import { Armchair } from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.INTRO);
  const [userData, setUserData] = useState<UserFormData>({
    name: '',
    phone: '',
    email: '',
    gender: 'Nam',
    roomType: RoomType.LIVING_ROOM,
    style: DesignStyle.MODERN,
    budget: BudgetRange.MEDIUM,
    note: '',
    imageFile: null,
    imagePreviewUrl: null
  });
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleStart = () => setStep(AppStep.FORM);

  const handleFormSubmit = async () => {
    setStep(AppStep.ANALYZING);
    setErrorMessage(null);
    try {
      // 1. Thực hiện phân tích AI trước
      const result = await analyzeSpaceWithGemini(userData);
      
      // 2. Lưu kết quả ngay lập tức vào state để hiển thị
      setAnalysisResult(result);
      
      // 3. Gửi dữ liệu vào Google Sheet (chạy ngầm, không block UI)
      // Chúng ta gọi hàm này nhưng không await để UI chuyển cảnh ngay lập tức cho mượt
      saveLeadToSheet(userData, result).catch(err => console.error("Lỗi lưu sheet:", err));

      setStep(AppStep.RESULT);
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message || "Đã có lỗi xảy ra. Vui lòng thử lại.");
      setStep(AppStep.FORM);
    }
  };

  const handleUnlock = () => {
    // In a real app, this might trigger another specific tracking event
    setStep(AppStep.UNLOCK);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] font-sans text-stone-800 selection:bg-amber-100">
      
      {/* Navbar / Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-stone-100 z-50 h-16 flex items-center justify-center">
        <div className="flex items-center gap-2 text-stone-900 font-serif font-bold text-lg">
          <Armchair className="w-6 h-6 text-amber-600" />
          <span>LuxeSpace AI</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="pt-20 pb-8 px-4 w-full max-w-5xl mx-auto min-h-screen flex flex-col">
        {errorMessage && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200 text-sm text-center">
            {errorMessage}
          </div>
        )}

        <div className="flex-grow flex flex-col justify-center">
          {step === AppStep.INTRO && <StepIntro onStart={handleStart} />}
          
          {step === AppStep.FORM && (
            <StepForm 
              userData={userData} 
              setUserData={setUserData} 
              onSubmit={handleFormSubmit} 
            />
          )}
          
          {step === AppStep.ANALYZING && <StepLoading />}
          
          {step === AppStep.RESULT && analysisResult && (
            <StepResult 
              data={analysisResult} 
              userData={userData}
              onUnlock={handleUnlock} 
            />
          )}

          {step === AppStep.UNLOCK && <StepUnlock userData={userData} />}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-stone-400">
        <p>© 2024 LuxeSpace AI Interior Design. All rights reserved.</p>
      </footer>

    </div>
  );
};

export default App;
