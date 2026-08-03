import { LessonInfo, ProcessingOptions } from "../types";

export const generateNLSLessonPlan = async (
  info: LessonInfo,
  options: ProcessingOptions
): Promise<string> => {
  try {
    const userApiKey = localStorage.getItem("USER_GEMINI_API_KEY") || "";
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
        throw new Error(`Máy chủ gặp sự cố kết nối (Mã lỗi ${response.status}). Vui lòng thử lại.`);
      }
      throw new Error("Định dạng dữ liệu trả về từ máy chủ không hợp lệ.");
    }

    if (!response.ok) {
      throw new Error(data.error || `Lỗi từ Server AI (${response.status})`);
    }

    if (!data.text) {
      throw new Error("Server AI trả về kết quả rỗng.");
    }

    return data.text;
  } catch (err: any) {
    console.error("Lỗi khi kết nối với server API:", err);
    const detailMsg = err.message || (typeof err === "string" ? err : JSON.stringify(err)) || "Không thể kết nối đến máy chủ AI";
    throw new Error(detailMsg);
  }
};
