import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION, NLS_FRAMEWORK_DATA } from "./constants";
import { LessonInfo, ProcessingOptions } from "./types";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use JSON and URL-encoded body parsers with generous limits for large documents
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // API route for generating lesson plans runs server-side to hide the API Key
  app.post("/api/generate-lesson-plan", async (req, res, next) => {
    try {
      const { info, options } = req.body as { info: LessonInfo; options: ProcessingOptions };
      if (!info || !options) {
        return res.status(400).json({ error: "Thiếu dữ liệu đầu vào để tạo giáo án." });
      }

      const apiKey = (req.headers["x-api-key"] as string) ||
                     process.env.GEMINI_API_KEY || 
                     process.env.API_KEY || 
                     process.env.KAY_API_GEMINI || 
                     process.env.KEY_API_GEMINI || 
                     process.env.GEMINI_KEY || 
                     process.env.GEMINI_API;
      if (!apiKey || !apiKey.trim()) {
        return res.status(400).json({
          error: "Chưa thiết lập Gemini API Key. Vui lòng nhấn nút 'CẤU HÌNH API KEY' ở thanh trên cùng để dán API Key của bạn.",
        });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey.trim(),
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      // Sử dụng các tên mô hình chính thức và chuẩn hóa theo SDK @google/genai
      const primaryModel = "gemini-3.6-flash";
      const fallbackModel = "gemini-flash-latest";
      const tertiaryModel = "gemini-3.1-flash-lite";

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

      const userPrompt = `
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

      const callModel = async (modelId: string) => {
        const response = await ai.models.generateContent({
          model: modelId,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.1,
          },
          contents: userPrompt,
        });

        let text = response.text || "";

        // Post-processing to fix LaTeX equations or subscripts formatting
        text = text.replace(/\$\$?([^$]+)\$\$?/g, (match, content) => {
          if (content.includes("MATH_ID")) return match;

          let fixed = content;
          fixed = fixed.replace(/_\{([^}]+)\}/g, "<sub>$1</sub>");
          fixed = fixed.replace(/\^\{([^}]+)\}/g, "<sup>$1</sup>");
          fixed = fixed.replace(/_([a-zA-Z0-9])/g, "<sub>$1</sub>");
          fixed = fixed.replace(/\^([a-zA-Z0-9])/g, "<sup>$1</sup>");
          fixed = fixed.replace(/([A-Za-z])\{([0-9]+)\}/g, "$1<sub>$2</sub>");
          return fixed;
        });

        text = text.replace(/_\{([^}]+)\}/g, "<sub>$1</sub>");
        text = text.replace(/\^\{([^}]+)\}/g, "<sup>$1</sup>");
        text = text.replace(/([A-Za-z])\{([0-9]+)\}/g, "$1<sub>$2</sub>");

        return text;
      };

      // Hàm làm sạch và trích xuất thông điệp lỗi dạng văn bản rõ ràng, loại bỏ chuỗi JSON thô
      const extractCleanErrorMessage = (err: any): string => {
        if (!err) return "Lỗi không xác định";
        let msg = err?.message || String(err);
        
        for (let i = 0; i < 3; i++) {
          if (typeof msg === "string" && (msg.trim().startsWith("{") || msg.trim().startsWith("["))) {
            try {
              const parsed = JSON.parse(msg.trim());
              if (parsed?.error?.message) {
                msg = parsed.error.message;
              } else if (parsed?.message) {
                msg = parsed.message;
              } else {
                break;
              }
            } catch (_) {
              break;
            }
          }
        }

        if (typeof msg === "object" && msg !== null) {
          if ((msg as any).error?.message) msg = (msg as any).error.message;
          else if ((msg as any).message) msg = (msg as any).message;
          else msg = JSON.stringify(msg);
        }

        return String(msg);
      };

      try {
        console.log(`[Server] Đang kết nối với model chính: ${primaryModel}`);
        const resultText = await callModel(primaryModel);
        if (!resultText) throw new Error("Mô hình chính trả về nội dung rỗng.");
        return res.json({ text: resultText });
      } catch (primaryErr: any) {
        const cleanPrimaryMsg = extractCleanErrorMessage(primaryErr);
        console.warn(`[Server] Model chính ${primaryModel} bị lỗi: ${cleanPrimaryMsg}. Thử model dự phòng ${fallbackModel}...`);
        try {
          const resultText = await callModel(fallbackModel);
          if (!resultText) throw new Error("Mô hình dự phòng trả về nội dung rỗng.");
          return res.json({ text: resultText });
        } catch (fallbackErr: any) {
          const cleanFallbackMsg = extractCleanErrorMessage(fallbackErr);
          console.warn(`[Server] Model dự phòng ${fallbackModel} bị lỗi: ${cleanFallbackMsg}. Thử model dự phòng ${tertiaryModel}...`);
          try {
            const resultText = await callModel(tertiaryModel);
            if (!resultText) throw new Error(`Mô hình ${tertiaryModel} trả về nội dung rỗng.`);
            return res.json({ text: resultText });
          } catch (tertiaryErr: any) {
            const cleanTertiaryMsg = extractCleanErrorMessage(tertiaryErr);
            console.error(`[Server] Tất cả các mô hình AI đều thất bại. Chi tiết lỗi:`, cleanPrimaryMsg);
            
            const pMsg = cleanPrimaryMsg;
            
            // Check for common error types
            if (pMsg.includes("API_KEY_INVALID") || pMsg.includes("API key not valid") || pMsg.includes("403") || pMsg.includes("401") || pMsg.includes("invalid API key")) {
              return res.status(401).json({
                error: "Mã API Key không hợp lệ hoặc đã bị vô hiệu hóa. Vui lòng bấm nút 'CẤU HÌNH API KEY' ở góc trên để đổi API Key Gemini mới.",
              });
            }
            if (pMsg.includes("429") || pMsg.includes("RESOURCE_EXHAUSTED") || pMsg.includes("Quota exceeded") || pMsg.includes("quota")) {
              return res.status(429).json({
                error: "Mã API Key hiện tại đã hết lượt gọi miễn phí trong phút này (Quota Exceeded - 429). Vui lòng đợi 1-2 phút hoặc bấm nút 'CẤU HÌNH API KEY' để đổi API Key Gemini cá nhân.",
              });
            }

            return res.status(500).json({
              error: `Thông báo từ AI: ${pMsg}. Nếu sự cố tiếp diễn, vui lòng nhấn nút 'CẤU HÌNH API KEY' ở trên để dán khóa API Gemini của bạn.`,
            });
          }
        }
      }
    } catch (err: any) {
      console.error("[Server API Error]:", err);
      return res.status(500).json({ error: err.message || "Lỗi xử lý yêu cầu soạn giáo án từ AI." });
    }
  });

  // Middleware xử lý lỗi tập trung cho toàn bộ API (đảm bảo luôn phản hồi dạng JSON)
  app.use("/api", (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("[API Error Handler]:", err);
    if (err.type === 'entity.too.large') {
      return res.status(413).json({ error: "Dung lượng giáo án quá lớn (vượt quá giới hạn 50MB). Vui lòng rút ngắn nội dung file." });
    }
    return res.status(err.status || 500).json({
      error: err.message || "Đã xảy ra lỗi kết nối với API máy chủ."
    });
  });

  // Vite development integration or production static files serving
  if (process.env.NODE_ENV !== "production") {
    console.log("[Server] Đang khởi chạy Vite ở chế độ development...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("[Server] Đang khởi chạy ở chế độ production...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Server fullstack đang chạy cực kì mượt mà tại http://0.0.0.0:${PORT}`);
  });
}

startServer();
