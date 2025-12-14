import { UserFormData, AIAnalysisResult } from "../types";

// URL Web App từ Google Apps Script của bạn
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzrOruBkvjckIsQlmr-pZO25gCbVOVEXawsTBI_vJ2IXIm7fCNePbas-6qU98yLa4Yeow/exec";

export const saveLeadToSheet = async (userData: UserFormData, aiResult: AIAnalysisResult | null) => {
  try {
    const aiSummary = aiResult 
      ? `Hiện trạng: ${aiResult.currentSpaceAnalysis}. \nĐề xuất: ${aiResult.options.map(o => o.title).join(', ')}`
      : "Chưa có kết quả (Lỗi hoặc người dùng thoát sớm)";

    const payload = {
      timestamp: new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }), // Định dạng ngày giờ Việt Nam
      name: userData.name,
      phone: userData.phone,
      email: userData.email,
      gender: userData.gender,
      roomType: userData.roomType,
      style: userData.style,
      budget: userData.budget,
      note: userData.note,
      imageName: userData.imageFile ? userData.imageFile.name : "Không có ảnh",
      aiSummary: aiSummary
    };

    // Sử dụng mode 'no-cors' là bắt buộc khi gọi Google Apps Script từ browser
    // để tránh lỗi CORS. Tuy nhiên, ta sẽ không đọc được response JSON trả về.
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log("Data sent to Google Sheet successfully");
  } catch (error) {
    console.error("Error saving to Google Sheet:", error);
    // Không throw error để tránh làm gián đoạn trải nghiệm người dùng
  }
};