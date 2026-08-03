import { GoogleGenAI } from "@google/genai";
import { LessonInfo, ProcessingOptions } from "../types";
import { SYSTEM_INSTRUCTION, NLS_FRAMEWORK_DATA } from "../constants";

const buildUserPrompt = (info: LessonInfo, options: ProcessingOptions): string => {
  let distributionContext = "";
  if (info.distributionContent && info.distributionContent.trim().length > 0) {
    distributionContext = `
    =========================================================
    🚨 QUY TẮC TỐI THƯỢNG (KHI CÓ PPCT - STRICT MODE):
    Người dùng ĐÃ CUNG CẤP nội dung Phân phối chương trình (PPCT).
    Đây là văn bản pháp quy, bạn phải tuân thủ TUYỆT ĐỐI các yêu cầu sau:

    1. Đọc tên bài học trong "NỘI DUNG GIÁO ÁN GỐC".
    2. Tìm bài học tương ứng trong nội dung PPCT.
    3. Trích xuất NGUYÊN VĂN, CHÍNH XÁC nội dung cột "Năng lực số" (hoặc YCCĐ năng lực số) của bài học đó.
    4. Đưa nội dung trích xuất đó vào phần Mục tiêu Năng lực số.
    
    ⛔ CÁC ĐIỀU CẤM (STRICTLY PROHIBITED):
    - CẤM TUYỆT ĐỐI việc tự ý thêm bất kỳ năng lực số nào khác không có trong PPCT của bài học này (Trừ khi có YÊU CẦU THỦ CÔNG bên dưới).
    - CẤM tự ý nâng cao hay thay đổi cấp độ nếu PPCT không yêu cầu.
    - CẤM dùng Khung năng lực số tham chiếu để bịa thêm mục tiêu. CHỈ dùng những gì PPCT ghi.
    - Nếu cột năng lực số trong PPCT để trống, thì mục tiêu NLS ghi là: "Không có (theo PPCT)".

    Đánh dấu mục tiêu này bằng dòng chữ: "(Nội dung trích xuất nguyên văn từ PPCT)".

    NỘI DUNG PPCT:
    ${info.distributionContent}
    =========================================================
    `;
  }

  let manualContext = "";
  if (info.manualNLS && info.manualNLS.length > 0) {
    const manualItems = info.manualNLS
      .map((item) => `- Năng lực [${item.code} - ${item.name}]:\n  Nội dung yêu cầu: ${item.description}`)
      .join("\n\n");
    manualContext = `
    =========================================================
    🎯 YÊU CẦU CỤ THỂ TỪ GIÁO VIÊN (MANUAL INPUT - ƯU TIÊN CAO NHẤT):
    Người dùng đã chỉ định cụ thể các năng lực và nội dung yêu cầu cần tích hợp. 
    Bạn BẮT BUỘC phải đưa các nội dung này vào giáo án, ngay cả khi PPCT không đề cập.
    
    Danh sách yêu cầu:
    ${manualItems}
    
    NHIỆM VỤ QUAN TRỌNG:
    1. Đọc kỹ "Nội dung yêu cầu" của từng năng lực ở trên.
    2. Tự động PHÂN TÍCH và XÁC ĐỊNH xem nội dung yêu cầu này phù hợp nhất để đưa vào phần nào, hoạt động nào trong giáo án (ví dụ: Khởi động, Hình thành kiến thức, Luyện tập, Vận dụng, hay phần Mục tiêu).
    3. Tích hợp khéo léo và logic nội dung đó vào đúng vị trí bạn đã xác định trong giáo án.
    =========================================================
    `;
  }

  return `
    DỮ LIỆU THAM CHIẾU KHUNG NĂNG LỰC SỐ (Chỉ sử dụng khi KHÔNG CÓ file PPCT hoặc để hiểu rõ mã năng lực trong PPCT):
    ${NLS_FRAMEWORK_DATA}

    THÔNG TIN GIÁO ÁN ĐẦU VÀO:
    - Bộ sách: ${info.textbook}
    - Cấp học: ${info.schoolLevel}
    - Môn học: ${info.subject}
    - Khối lớp: ${info.grade}
    
    ${distributionContext}

    ${manualContext}

    YÊU CẦU XỬ LÝ NỘI DUNG:
    ${options.analyzeOnly ? "- Chỉ phân tích, không chỉnh sửa chi tiết." : "- Chỉnh sửa giáo án và TÍCH HỢP NĂNG LỰC SỐ vào các hoạt động dạy học."}
    ${options.detailedReport ? "- Kèm theo bảng giải thích chi tiết mã năng lực đã chọn ở cuối bài." : ""}
    
    YÊU CẦU VỀ ĐỊNH DẠNG (BẮT BUỘC):
    1. ĐỊNH DẠNG ĐẦU VÀO: Nội dung giáo án gốc bên dưới có thể là HTML (được chuyển từ DOCX). Các công thức toán học đã được thay thế bằng các mã giữ chỗ có dạng [MATH_ID_...].
    2. NHIỆM VỤ: Bạn phải chuyển đổi nội dung này sang MARKDOWN, đồng thời TÍCH HỢP nội dung NLS.
    3. BẢO TOÀN CẤU TRÚC: 
       - Giữ nguyên tất cả các Bảng (Table) của giáo án gốc (chuyển sang Markdown Table). KHÔNG ĐƯỢC làm mất bảng hoặc biến bảng thành văn bản thường.
       - Giữ nguyên các tiêu đề, danh sách.
       - Giữ nguyên các đoạn in đậm/nghiêng.
    4. BẢO TOÀN CÔNG THỨC TOÁN HỌC VÀ HÓA HỌC (QUAN TRỌNG NHẤT): 
       - Bạn TUYỆT ĐỐI KHÔNG ĐƯỢC thay đổi, dịch, hay xóa các mã giữ chỗ [MATH_ID_...]. Phải giữ nguyên vẹn các mã này trong văn bản đầu ra.
       - KHÔNG ĐƯỢC đặt các mã này bên trong các thẻ định dạng như in đậm (**), in nghiêng (*), gạch chân (<u>).
       - TUYỆT ĐỐI KHÔNG SỬ DỤNG LATEX (DẤU $ HOẶC $$) TRONG TOÀN BỘ VĂN BẢN ĐẦU RA.
       - Đối với các công thức hóa học hoặc các chữ có chỉ số dưới/chỉ số trên (ví dụ: C<sub>15</sub>H<sub>31</sub>COOH, m<sup>2</sup>), hãy giữ nguyên thẻ HTML <sub> và <sup>. KHÔNG chuyển thành dạng $C_{15}H_{31}COOH$.
    5. NLS BỔ SUNG: Dùng thẻ <nls>...</nls> để bao bọc nội dung NLS bạn tích hợp thêm vào (giúp hệ thống nhận diện và hiển thị màu đỏ). KHÔNG sử dụng <u> gạch chân như trước.
    
    ĐỊNH DẠNG ĐẦU RA (NGHIÊM NGẶT):
    - Trả về toàn bộ nội dung giáo án dưới dạng Markdown.
    - Cấu trúc mục TIÊU BÀI HỌC bắt buộc:
       1. Về kiến thức
       2. Về năng lực (Bao gồm: Năng lực Chung, Năng lực Đặc thù môn học, và NĂNG LỰC SỐ).
       3. Về phẩm chất
    - KHÔNG ĐƯỢC để mục Năng lực số tách rời ở mục 4 như cũ. Phải lồng nó vào mục 2.
    - KHÔNG ĐƯỢC CÓ LỜI DẪN.
    - Bắt đầu ngay bằng nội dung giáo án.
    
    NỘI DUNG GIÁO ÁN GỐC (CÓ THỂ LÀ HTML):
    ${info.content}
  `;
};

const postProcessResult = (text: string): string => {
  let fixed = text.replace(/\$\$?([^$]+)\$\$?/g, (match, content) => {
    if (content.includes("MATH_ID")) return match;
    let f = content;
    f = f.replace(/_\{([^}]+)\}/g, "<sub>$1</sub>");
    f = f.replace(/\^\{([^}]+)\}/g, "<sup>$1</sup>");
    f = f.replace(/_([a-zA-Z0-9])/g, "<sub>$1</sub>");
    f = f.replace(/\^([a-zA-Z0-9])/g, "<sup>$1</sup>");
    f = f.replace(/([A-Za-z])\{([0-9]+)\}/g, "$1<sub>$2</sub>");
    return f;
  });

  fixed = fixed.replace(/_\{([^}]+)\}/g, "<sub>$1</sub>");
  fixed = fixed.replace(/\^\{([^}]+)\}/g, "<sup>$1</sup>");
  fixed = fixed.replace(/([A-Za-z])\{([0-9]+)\}/g, "$1<sub>$2</sub>");
  return fixed;
};

async function generateLessonPlanClientSide(
  info: LessonInfo,
  options: ProcessingOptions,
  apiKey: string
): Promise<string> {
  if (!apiKey || !apiKey.trim()) {
    throw new Error("Trang web đang chạy trên Netlify/Web tĩnh. Vui lòng bấm nút 'CẤU HÌNH API KEY' ở góc trên để dán API Key Gemini của bạn để ứng dụng hoạt động!");
  }

  const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
  const userPrompt = buildUserPrompt(info, options);

  const primaryModel = "gemini-3.6-flash";
  const fallbackModel = "gemini-flash-latest";
  const tertiaryModel = "gemini-3.1-flash-lite";

  const callModel = async (modelId: string) => {
    const res = await ai.models.generateContent({
      model: modelId,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.1,
      },
      contents: userPrompt,
    });
    return res.text || "";
  };

  try {
    const resText = await callModel(primaryModel);
    if (resText) return postProcessResult(resText);
  } catch (err1: any) {
    console.warn(`[Client AI] Model ${primaryModel} error:`, err1);
    try {
      const resText = await callModel(fallbackModel);
      if (resText) return postProcessResult(resText);
    } catch (err2: any) {
      console.warn(`[Client AI] Model ${fallbackModel} error:`, err2);
      try {
        const resText = await callModel(tertiaryModel);
        if (resText) return postProcessResult(resText);
      } catch (err3: any) {
        const errMsg = String(err3?.message || err3 || err1?.message || "");
        if (errMsg.includes("API_KEY_INVALID") || errMsg.includes("API key not valid") || errMsg.includes("400") || errMsg.includes("403") || errMsg.includes("401")) {
          throw new Error("Mã API Key không hợp lệ hoặc đã bị thu hồi. Vui lòng kiểm tra lại chìa khóa trong mục 'CẤU HÌNH API KEY'.");
        }
        if (errMsg.includes("429") || errMsg.includes("RESOURCE_EXHAUSTED") || errMsg.includes("quota")) {
          throw new Error("API Key này đã hết lượt gọi trong phút này (Quota Exceeded). Vui lòng đợi 1-2 phút hoặc đổi API Key khác.");
        }
        throw new Error(`Lỗi kết nối Gemini AI: ${errMsg}`);
      }
    }
  }

  throw new Error("Không nhận được kết quả từ Gemini AI.");
}

export const generateNLSLessonPlan = async (
  info: LessonInfo,
  options: ProcessingOptions
): Promise<string> => {
  const userApiKey = localStorage.getItem("USER_GEMINI_API_KEY") || "";

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (userApiKey.trim()) {
      headers["x-api-key"] = userApiKey.trim();
    }

    const response = await fetch("/api/generate-lesson-plan", {
      method: "POST",
      headers,
      body: JSON.stringify({ info, options }),
    });

    // Handle Netlify / Static hosting where /api route does not exist (returns 404 or index.html)
    if (response.status === 404) {
      console.log("[GeminiService] Server /api route returned 404. Switching to client-side Gemini execution...");
      return await generateLessonPlanClientSide(info, options, userApiKey);
    }

    const responseText = await response.text();
    let data: any = {};
    try {
      data = JSON.parse(responseText);
    } catch (parseErr) {
      console.error("Phản hồi không phải dạng JSON:", responseText);
      if (!response.ok) {
        if (response.status === 413) {
          throw new Error("Dung lượng giáo án quá lớn. Vui lòng rút ngắn nội dung hoặc giảm dung lượng file.");
        }
        if (response.status === 504 || response.status === 502) {
          throw new Error("Hệ thống mất quá nhiều thời gian để xử lý. Vui lòng thử lại sau ít phút.");
        }
        // Fall back to client side if HTML error page was returned
        return await generateLessonPlanClientSide(info, options, userApiKey);
      }
      throw new Error("Định dạng dữ liệu trả về từ máy chủ không hợp lệ.");
    }

    if (!response.ok) {
      // If error is 401 (Invalid API Key) or 400 with invalid key, check if user supplied key and fall back to client side to give direct feedback
      if (response.status === 401 || response.status === 403) {
        if (userApiKey.trim()) {
          return await generateLessonPlanClientSide(info, options, userApiKey);
        }
      }
      throw new Error(data.error || `Lỗi từ Server AI (${response.status})`);
    }

    if (!data.text) {
      throw new Error("Server AI trả về kết quả rỗng.");
    }

    return data.text;
  } catch (err: any) {
    console.error("Lỗi khi kết nối API:", err);
    
    // If backend fetch completely failed (e.g., offline or host down), attempt client-side execution if user has key
    if (userApiKey.trim() && err.message?.includes("Failed to fetch")) {
      try {
        return await generateLessonPlanClientSide(info, options, userApiKey);
      } catch (clientErr: any) {
        throw clientErr;
      }
    }

    const detailMsg = err.message || (typeof err === "string" ? err : JSON.stringify(err)) || "Không thể kết nối đến máy chủ AI";
    throw new Error(detailMsg);
  }
};

