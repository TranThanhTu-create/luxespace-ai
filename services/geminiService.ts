import { GoogleGenAI, Type } from "@google/genai";
import { UserFormData, AIAnalysisResult, DesignOption } from "../types";

const SYSTEM_INSTRUCTION = `
Bạn là một Kiến trúc sư và Chuyên gia thiết kế nội thất AI hàng đầu. 
Nhiệm vụ của bạn là phân tích hình ảnh không gian hiện trạng của khách hàng và đưa ra 3 phương án thiết kế nội thất khác nhau dựa trên nhu cầu của họ.

Bạn cần trả về kết quả dưới dạng JSON theo đúng schema được yêu cầu. Không trả về markdown, chỉ trả về JSON thuần túy.

3 Phương án cần đề xuất:
1. Phương án Tối ưu công năng (Functional): Tập trung vào sự tiện dụng, bố trí khoa học, tiết kiệm không gian.
2. Phương án Thẩm mỹ & Cảm xúc (Aesthetic): Tập trung vào decor, màu sắc, ánh sáng, tạo mood.
3. Phương án Cao cấp & Lâu dài (Premium): Sử dụng vật liệu tốt, phong cách sang trọng, bền vững.

Hãy sử dụng ngôn ngữ chuyên nghiệp nhưng dễ hiểu, tạo cảm giác thân thiện và cao cấp.
`;

export const analyzeSpaceWithGemini = async (userData: UserFormData): Promise<AIAnalysisResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing");
  }

  if (!userData.imageFile) {
    throw new Error("Image is required");
  }

  const base64Image = await fileToGenerativePart(userData.imageFile);
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // STEP 1: Text Analysis and Option Generation
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
              data: base64Image
            }
          },
          { text: analysisPrompt }
        ]
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            currentSpaceAnalysis: {
              type: Type.STRING,
              description: "Nhận xét ngắn gọn 1-2 câu về hiện trạng không gian (ánh sáng, diện tích, hiện vật) dựa trên ảnh."
            },
            options: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: {
                    type: Type.STRING,
                    enum: ["FUNCTIONAL", "AESTHETIC", "PREMIUM"],
                    description: "Loại phương án"
                  },
                  title: {
                    type: Type.STRING,
                    description: "Tên phương án thật hấp dẫn"
                  },
                  description: {
                    type: Type.STRING,
                    description: "Mô tả ý tưởng chính khoảng 2-3 dòng"
                  },
                  estimatedCost: {
                    type: Type.STRING,
                    description: "Dự toán chi phí phù hợp với ngân sách khách chọn"
                  },
                  keyFeatures: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "3 điểm nổi bật nhất của phương án này"
                  }
                },
                required: ["type", "title", "description", "estimatedCost", "keyFeatures"]
              }
            }
          },
          required: ["currentSpaceAnalysis", "options"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    analysisResult = JSON.parse(text) as AIAnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Không thể phân tích ảnh lúc này. Vui lòng thử lại.");
  }

  // STEP 2: Generate Images for each option
  // We utilize the original image as a reference for structure, combined with the new design description.
  
  try {
    const optionsWithImages = await Promise.all(analysisResult.options.map(async (option) => {
      const imagePrompt = `
        Interior design render, photorealistic, 4k, architectural photography.
        Redesign this room based on the following concept:
        Style: ${userData.style} - ${option.title}.
        Description: ${option.description}.
        Key features: ${option.keyFeatures.join(', ')}.
        Maintain the structural layout of the original room (windows, doors, walls) but change furniture, materials, and lighting to match the new style.
      `;

      try {
        const imageResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType: userData.imageFile!.type,
                  data: base64Image
                }
              },
              { text: imagePrompt }
            ]
          },
          config: {
             // imageConfig is usually inferred or can be specified if needed, 
             // but here we rely on the input image aspect ratio or model default.
          }
        });

        let generatedImageUrl: string | null = null;
        
        if (imageResponse.candidates?.[0]?.content?.parts) {
          for (const part of imageResponse.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
              generatedImageUrl = `data:image/png;base64,${part.inlineData.data}`;
              break;
            }
          }
        }
        
        return { ...option, imageUrl: generatedImageUrl };

      } catch (imgError) {
        console.warn(`Failed to generate image for option ${option.title}`, imgError);
        return { ...option, imageUrl: null }; // Fallback to no image if generation fails
      }
    }));

    return {
      ...analysisResult,
      options: optionsWithImages
    };

  } catch (error) {
    console.error("Image Generation Pipeline Error:", error);
    // Return text analysis even if image generation completely fails (though individual fail is handled above)
    return analysisResult; 
  }
};

const fileToGenerativePart = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = result.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
