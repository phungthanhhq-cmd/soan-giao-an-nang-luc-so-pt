# Quy tắc dự án & Chỉ dẫn vận hành (AGENTS.md)

1. **Bảo tồn cấu trúc ứng dụng**:
   - Giữ nguyên toàn bộ cấu trúc giao diện, luồng xử lý và logic đã hoàn thiện.
   - Không tự ý thay đổi hoặc tái cấu trúc lớn khi chưa có yêu cầu cụ thể từ người dùng.

2. **Cấu hình mô hình AI**:
   - Model chính: `gemini-3.6-flash` (dùng SDK `@google/genai`).
   - Luôn đảm bảo cơ chế fallback và xử lý lỗi chuyên nghiệp, thông báo rõ ràng cho người dùng.

3. **Trải nghiệm người dùng**:
   - Duy trì hiệu năng cao, giao diện mượt mà và trực quan.
   - Hỗ trợ chọn nhiều Mã Tích hợp Năng lực số (Multi-select) linh hoạt.
