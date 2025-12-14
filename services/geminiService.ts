import { GoogleGenAI, Type } from "@google/genai";
import { UserFormData, AIAnalysisResult } from "../types";

const SYSTEM_INSTRUCTION = `
Bạn là một Kiến trúc sư và Chuyên gia thiết kế nội thất AI hàng đầu. 
Nhiệm vụ của bạn là phân tích hình ảnh không gian hiện trạng của khách hàng và đưa ra 3 phương án thiết kế nội thất khác nhau dựa trên nhu cầu của họ.

Bạn cần trả về kết quả dưới dạng JSON theo đúng schema được yêu cầu. Không trả về markdown, chỉ trả về JSON thuần túy.

3 Phương án cần đề xuất:
1. Phương án Tối ưu công năng (Functional)
2. Phương án Thẩm mỹ & Cảm xúc (Aesthetic)
3. Phương án Cao cấp & Lâu dài (Premium)
`;

export const analyzeSpaceWithGemini = async (
  userData: UserFormData
): Promise<AIAnalysisResult> => {

  // ✅ CÁCH ĐÚNG CHO VITE
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  if (!API_KEY) {
    throw new Error("API Key is missing");
  }

  if (!userData.imageFile) {
    throw new Error("Image is required");
  }

  const base64Image = await fileToGenerativePart(userData.imageFile);

  const ai = new GoogleGenAI({
    apiKey: API_KEY,
  });

  const analysisPrompt = `
Phân tích hình ảnh không gian này.
Thông tin khách hàng:
- Loại phòng: ${userData.roomType}
- Phong cách mong muốn: ${userData.style}
- Ngân sách: ${userData.budget}
- Ghi chú thêm: ${userData.note}

Hãy đưa ra nhận xét về hiện trạng và 3 phương án thiết kế chi tiết.
`;

  let analysisResult: AIAnalysisResult;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: userData.imageFile.type,
              data: base64Image,
            },
          },
          { text: analysisPrompt },
        ],
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            currentSpaceAnalysis: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: {
                    type: Type.STRING,
                    enum: ["FUNCTIONAL", "AESTHETIC", "PREMIUM"],
                  },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  estimatedCost: { type: Type.STRING },
                  keyFeatures: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: [
                  "type",
                  "title",
                  "description",
                  "estimatedCost",
                  "keyFeatures",
                ],
              },
            },
          },
          required: ["currentSpaceAnalysis", "options"],
        },
      },
    });

    if (!response.text) {
      throw new Error("No response from AI");
    }

    analysisResult = JSON.parse(response.text) as AIAnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Không thể phân tích ảnh lúc này. Vui lòng thử lại.");
  }

  // STEP 2: Generate images for each option
  const optionsWithImages = await Promise.all(
    analysisResult.options.map(async (option) => {
      try {
        const imagePrompt = `
Interior design render, photorealistic, 4k.
Redesign this room based on:
${option.title}
${option.description}
Features: ${option.keyFeatures.join(", ")}
`;

        const imageResponse = await ai.models.generateContent({
          model: "gemini-2.5-flash-image",
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType: userData.imageFile!.type,
                  data: base64Image,
                },
              },
              { text: imagePrompt },
            ],
          },
        });

        let imageUrl: string | null = null;

        const parts = imageResponse.candidates?.[0]?.content?.parts;
        if (parts) {
          for (const part of parts) {
            if (part.inlineData?.data) {
              imageUrl = `data:image/png;base64,${part.inlineData.data}`;
              break;
            }
          }
        }

        return { ...option, imageUrl };
      } catch {
        return { ...option, imageUrl: null };
      }
    })
  );

  return {
    ...analysisResult,
    options: optionsWithImages,
  };
};

const fileToGenerativePart = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
