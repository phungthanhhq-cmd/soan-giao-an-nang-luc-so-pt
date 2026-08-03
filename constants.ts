
export const NLS_COMPONENT_OPTIONS = [
  { code: "1.1", label: "1.1. Duyệt, tìm kiếm và lọc dữ liệu" },
  { code: "1.2", label: "1.2. Đánh giá dữ liệu, thông tin và nội dung số" },
  { code: "1.3", label: "1.3. Quản lý dữ liệu, thông tin và nội dung số" },
  { code: "2.1", label: "2.1. Tương tác thông qua công nghệ số" },
  { code: "2.2", label: "2.2. Chia sẻ thông tin và nội dung thông qua công nghệ số" },
  { code: "2.3", label: "2.3. Sử dụng công nghệ số để thực hiện trách nhiệm công dân" },
  { code: "2.4", label: "2.4. Hợp tác thông qua công nghệ số" },
  { code: "2.5", label: "2.5. Thực hiện quy tắc ứng xử trên mạng" },
  { code: "2.6", label: "2.6. Quản lý danh tính số" },
  { code: "3.1", label: "3.1. Phát triển nội dung số" },
  { code: "3.2", label: "3.2. Tích hợp và tạo lập lại nội dung số" },
  { code: "3.3", label: "3.3. Thực thi bản quyền và giấy phép" },
  { code: "3.4", label: "3.4. Lập trình" },
  { code: "4.1", label: "4.1. Bảo vệ thiết bị" },
  { code: "4.2", label: "4.2. Bảo vệ dữ liệu cá nhân và quyền riêng tư" },
  { code: "4.3", label: "4.3. Bảo vệ sức khỏe và an sinh số" },
  { code: "4.4", label: "4.4. Bảo vệ môi trường" },
  { code: "5.1", label: "5.1. Giải quyết các vấn đề kỹ thuật" },
  { code: "5.2", label: "5.2. Xác định nhu cầu và giải pháp công nghệ" },
  { code: "5.3", label: "5.3. Sử dụng sáng tạo công nghệ số" },
  { code: "5.4", label: "5.4. Xác định các vấn đề cần cải thiện về năng lực số" },
  { code: "6.1", label: "6.1. Hiểu biết về trí tuệ nhân tạo (AI)" },
  { code: "6.2", label: "6.2. Sử dụng trí tuệ nhân tạo" },
  { code: "6.3", label: "6.3. Đánh giá trí tuệ nhân tạo" },
];

export const NLS_LEVEL_DETAILS: Record<string, { code: string; desc: string; level: number }[]> = {
  "1.1": [
    { code: "1.1.B1", level: 1, desc: "Xác định nhu cầu thông tin, tìm kiếm dữ liệu qua tìm kiếm đơn giản trong môi trường số." },
    { code: "1.1.B2", level: 2, desc: "Xác định nhu cầu, tìm được dữ liệu đơn giản, tự chủ hơn và biết cách điều hướng giữa chúng." },
    { code: "1.1.TC1a", level: 3, desc: "Giải thích rõ ràng nhu cầu thông tin cá nhân cho các mục đích cụ thể." },
    { code: "1.1.TC1b", level: 3, desc: "Thực hiện tìm kiếm thông tin, dữ liệu trong môi trường số theo quy trình xác định." },
    { code: "1.1.TC1c", level: 3, desc: "Giải thích cách truy cập và điều hướng qua các kết quả tìm kiếm." },
    { code: "1.1.TC1d", level: 3, desc: "Giải thích được các chiến lược tìm kiếm thông tin theo quy trình rõ ràng." },
    { code: "1.1.TC2a", level: 4, desc: "Minh họa được nhu cầu thông tin cá nhân và giải thích mục đích tìm kiếm." },
    { code: "1.1.TC2b", level: 4, desc: "Tổ chức tìm kiếm dữ liệu, thông tin và nội dung trong môi trường số một cách độc lập." },
    { code: "1.1.TC2c", level: 4, desc: "Mô tả cách truy cập và điều hướng nội dung số một cách thành thạo." },
    { code: "1.1.TC2d", level: 4, desc: "Tổ chức và thực hiện các chiến lược tìm kiếm thông tin một cách hiệu quả." },
    { code: "1.1.B5", level: 5, desc: "Áp dụng kỹ thuật tìm kiếm nâng cao, tự đề xuất chiến lược tìm kiếm hiệu quả." },
    { code: "1.1.B6", level: 6, desc: "Đánh giá nhu cầu, điều chỉnh linh hoạt và đa dạng chiến lược tìm kiếm trong bối cảnh phức tạp." },
  ],
  "1.2": [
    { code: "1.2.B1", level: 1, desc: "Phát hiện được độ tin cậy và độ chính xác cơ bản của các nguồn dữ liệu chung." },
    { code: "1.2.B2", level: 2, desc: "Đánh giá độ tin cậy của các nguồn tin chung với khả năng tự chủ và hướng dẫn phù hợp." },
    { code: "1.2.TC1a", level: 3, desc: "Phân tích, so sánh và đánh giá độ tin cậy của các nguồn dữ liệu đã được tổ chức rõ ràng." },
    { code: "1.2.TC1b", level: 3, desc: "Phân tích, diễn giải và đánh giá nội dung số dựa trên các tiêu chí xác định." },
    { code: "1.2.TC2a", level: 4, desc: "Thực hiện phân tích, so sánh và đánh giá độc lập các nguồn dữ liệu/nội dung số." },
    { code: "1.2.TC2b", level: 4, desc: "Thực hiện diễn giải và đánh giá dữ liệu một cách độc lập dựa trên nhu cầu riêng." },
    { code: "1.2.B5", level: 5, desc: "Thực hiện đánh giá sâu sắc độ tin cậy, tiến hành đánh giá nhiều loại dữ liệu khác nhau." },
    { code: "1.2.B6", level: 6, desc: "Đánh giá có tính phê phán, phân tích các nguồn dữ liệu trong bối cảnh phức tạp." },
  ],
  "1.3": [
    { code: "1.3.TC1a", level: 3, desc: "Lựa chọn dữ liệu và nội dung phù hợp để tổ chức, lưu trữ và truy xuất thường xuyên." },
    { code: "1.3.TC1b", level: 3, desc: "Sắp xếp dữ liệu và nội dung một cách trật tự trong môi trường có cấu trúc." },
    { code: "1.3.TC2a", level: 4, desc: "Thực hiện sắp xếp và quản lý thông tin, dữ liệu giúp việc truy xuất dễ dàng." },
    { code: "1.3.TC2b", level: 4, desc: "Tổ chức thông tin, dữ liệu và nội dung hiệu quả trong môi trường có cấu trúc." }
  ],
  "2.1": [
    { code: "2.1.B1", level: 1, desc: "Lựa chọn các công nghệ số đơn giản để tương tác." },
    { code: "2.1.B2", level: 2, desc: "Xác định được các phương tiện giao tiếp phù hợp cho một bối cảnh cụ thể." },
    { code: "2.1.TC1a", level: 3, desc: "Thực hiện các tương tác xác định rõ và thường xuyên với các công nghệ số." },
    { code: "2.1.TC1b", level: 3, desc: "Lựa chọn phương tiện giao tiếp số phù hợp với quy trình cho một bối cảnh cụ thể." },
    { code: "2.1.TC2a", level: 4, desc: "Lựa chọn và sử dụng nhiều công nghệ số khác nhau để tương tác hiệu quả." },
    { code: "2.1.TC2b", level: 4, desc: "Lựa chọn linh hoạt nhiều phương tiện giao tiếp số phù hợp cho các bối cảnh khác nhau." },
    { code: "2.1.B5", level: 5, desc: "Sử dụng thuần thục many công nghệ số, chỉ dẫn được cho người khác phương tiện tốt nhất." },
    { code: "2.1.B6", level: 6, desc: "Thích nghi linh hoạt với nhiều công nghệ số để có sự tương tác tối ưu nhất." },
  ],
  "2.2": [
    { code: "2.2.TC1a", level: 3, desc: "Lựa chọn và xác định rõ các công nghệ số phù hợp để trao đổi dữ liệu/nội dung số." },
    { code: "2.2.TC1b", level: 3, desc: "Giải thích vai trò trung gian trong việc chia sẻ thông tin và nội dung số." },
    { code: "2.2.TC1c", level: 3, desc: "Minh họa rõ ràng và thường xuyên cách tham chiếu và ghi chú nguồn dữ liệu." },
    { code: "2.2.TC2a", level: 4, desc: "Vận dụng thành thạo các công nghệ số phù hợp để chia sẻ và trao đổi thông tin." },
    { code: "2.2.TC2b", level: 4, desc: "Đóng vai trò trung gian một cách chủ động trong việc chia sẻ thông tin qua công nghệ số." },
    { code: "2.2.TC2c", level: 4, desc: "Áp dụng đúng các phương pháp tham chiếu và trích dẫn nguồn khi chia sẻ nội dung." }
  ],
  "2.3": [
    { code: "2.3.TC1a", level: 3, desc: "Lựa chọn và sử dụng thành thạo các dịch vụ số phổ biến để tham gia xã hội." },
    { code: "2.3.TC1b", level: 3, desc: "Xác định rõ các công nghệ số hỗ trợ vai trò và trách nhiệm công dân số." },
    { code: "2.3.TC2a", level: 4, desc: "Lựa chọn độc lập các dịch vụ số phù hợp để thực hiện quyền và nghĩa vụ công dân." },
    { code: "2.3.TC2b", level: 4, desc: "Thảo luận và áp dụng các công nghệ số để nâng cao năng lực bản thân với tư cách công dân." }
  ],
  "2.4": [
    { code: "2.4.TC1a", level: 3, desc: "Lựa chọn và sử dụng thuần thục các công cụ số được xác định cho việc hợp tác nhóm." },
    { code: "2.4.TC2a", level: 4, desc: "Lựa chọn độc lập các công cụ và công nghệ số phù hợp cho các quy trình hợp tác phức tạp." }
  ],
  "2.5": [
    { code: "2.5.TC1a", level: 3, desc: "Làm rõ và áp dụng các chuẩn mực hành vi thông thường khi tương tác trong môi trường số." },
    { code: "2.5.TC1b", level: 3, desc: "Thể hiện các chiến lược và phương thức giao tiếp phù hợp với quy trình trong môi trường số." },
    { code: "2.5.TC1c", level: 3, desc: "Mô tả và tôn trọng các khía cạnh đa dạng văn hóa và thế hệ được xác định rõ ràng." },
    { code: "2.5.TC2a", level: 4, desc: "Thảo luận và thống nhất các chuẩn mực hành vi, cách ứng xử khi làm việc nhóm trực tuyến." },
    { code: "2.5.TC2b", level: 4, desc: "Thảo luận và lựa chọn các chiến lược giao tiếp số phù hợp một cách độc lập." },
    { code: "2.5.TC2c", level: 4, desc: "Thảo luận về sự đa dạng văn hóa/thế hệ và các lưu ý cần thiết trong tương tác số." }
  ],
  "2.6": [
    { code: "2.6.TC1a", level: 3, desc: "Phân biệt được các loại danh tính số thông thường và cách nhận diện chúng." },
    { code: "2.6.TC1b", level: 3, desc: "Giải thích các cách xác định rõ ràng để bảo vệ danh tiếng trực tuyến cá nhân." },
    { code: "2.6.TC1c", level: 3, desc: "Mô tả dữ liệu thu thập được thông qua các công cụ hoặc dịch vụ số thường dùng." },
    { code: "2.6.TC2a", level: 4, desc: "Hiển thị và quản lý độc lập các danh tính số cụ thể trên các nền tảng khác nhau." },
    { code: "2.6.TC2b", level: 4, desc: "Thảo luận và thực hiện các biện pháp cụ thể để bảo vệ uy tín và danh tiếng trực tuyến." },
    { code: "2.6.TC2c", level: 4, desc: "Thao tác và kiểm soát dữ liệu cá nhân tạo ra từ các công cụ/dịch vụ số một cách chủ động." }
  ],
  "3.1": [
    { code: "3.1.B1", level: 1, desc: "Xác định cách tạo và chỉnh sửa nội dung đơn giản ở các định dạng phổ biến." },
    { code: "3.1.B2", level: 2, desc: "Tạo nội dung đơn giản để thể hiện bản thân thông qua các phương tiện số." },
    { code: "3.1.TC1a", level: 3, desc: "Chỉ ra cách tạo, chỉnh sửa nội dung có mục tiêu cụ thể và định dạng rõ ràng." },
    { code: "3.1.TC2a", level: 4, desc: "Thực hiện tạo/chỉnh sửa nội dung số ở các định dạng khác nhau để thể hiện bản thân." },
    { code: "3.1.B5", level: 5, desc: "Áp dụng thuần thục các cách tạo nội dung, chỉ ra được những cách thể hiện bản thân tốt nhất." },
    { code: "3.1.B6", level: 6, desc: "Điều chỉnh và thay đổi nội dung bằng các định dạng phù hợp nhất cho mục đích sáng tạo." },
  ],
  "4.2": [
    { code: "4.2.B1", level: 1, desc: "Lựa chọn những cách thức đơn giản để bảo vệ dữ liệu cá nhân (mật khẩu, không chia sẻ linh tinh)." },
    { code: "4.2.B2", level: 2, desc: "Nhận biết cách sử dụng và chia sẻ thông tin định danh một cách an toàn." },
    { code: "4.2.TC1a", level: 3, desc: "Giải thích các quy tắc cơ bản và phổ biến để bảo vệ dữ liệu cá nhân trong môi trường số." },
    { code: "4.2.TC2a", level: 4, desc: "Thảo luận và áp dụng thành thạo các cách bảo vệ dữ liệu cá nhân và quyền riêng tư." },
    { code: "4.2.B5", level: 5, desc: "Áp dụng các cách thức đặc thù để bảo vệ dữ liệu và chia sẻ thông tin an toàn." },
    { code: "4.2.B6", level: 6, desc: "Đánh giá và lựa chọn phương án bảo mật tối ưu nhất cho từng loại dữ liệu." },
  ],
  "6.1": [
    { code: "6.1.B1", level: 1, desc: "Xác định được các khái niệm cơ bản về AI và nhận diện AI trong cuộc sống." },
    { code: "6.1.B2", level: 2, desc: "Giải thích được nguyên lý hoạt động cơ bản của AI và các thuật ngữ liên quan." },
    { code: "6.1.B3", level: 3, desc: "Áp dụng nguyên lý cơ bản của AI để giải quyết vấn đề đơn giản." },
    { code: "6.1.B4", level: 4, desc: "Phân tích cách AI hoạt động trong các ứng dụng cụ thể và so sánh các hệ thống." },
    { code: "6.1.B5", level: 5, desc: "Đánh giá hiệu quả của các hệ thống AI trong việc giải quyết tác vụ cụ thể." },
    { code: "6.1.B6", level: 6, desc: "Tổng hợp kiến thức để đề xuất cải tiến cho các hệ thống AI." },
  ],
  "6.2": [
    { code: "6.2.B1", level: 1, desc: "Nhận diện và thực hiện các thao tác cơ bản với công cụ AI đơn giản." },
    { code: "6.2.B2", level: 2, desc: "Sử dụng công cụ AI để thực hiện các nhiệm vụ học tập theo hướng dẫn." },
    { code: "6.2.B3", level: 3, desc: "Sử dụng hiệu quả AI trong công việc và học tập hàng ngày qua các dự án nhỏ." },
    { code: "6.2.B4", level: 4, desc: "Tối ưu hóa việc sử dụng các công cụ AI và quản lý triển khai trong dự án." },
    { code: "6.2.B5", level: 5, desc: "Phát triển các ứng dụng AI tùy chỉnh và đánh giá rủi ro đạo đức/pháp lý." },
    { code: "6.2.B6", level: 6, desc: "Tích hợp thuần thục AI vào quy trình làm việc và đảm bảo tính minh bạch/hiệu quả." },
  ]
};

// AI Specific Requirements by Grade (Decision 3439)
export const AI_GRADE_REQUIREMENTS: Record<number, { code: string; desc: string }[]> = {
  1: [
    { code: "A1.1", desc: "Nhận biết con người có cảm xúc, AI thì không; AI thể hiện cảm xúc do lập trình." },
    { code: "C1.1", desc: "Nhận biết AI trong một số sản phẩm quen thuộc (loa thông minh, robot hút bụi)." },
    { code: "D1.1", desc: "Nêu được ví dụ về tình huống AI học từ hình ảnh hoặc thông tin con người cung cấp." }
  ],
  6: [
    { code: "A1.6", desc: "Giải thích AI do con người tạo ra để phục vụ nhiệm vụ cụ thể, không tự sinh ra." },
    { code: "C1.6", desc: "Hiểu các thành phần cơ bản của AI (Dữ liệu + Thuật toán) và cách chúng hoạt động." },
    { code: "D1.6", desc: "Phân tích được khi nào nên hoặc không nên dùng AI trong các tình huống thực tế." }
  ],
  10: [
    { code: "A1.10", desc: "Xác định vai trò dẫn dắt của con người trong việc thiết kế và tùy chỉnh hệ thống AI." },
    { code: "C2.10", desc: "Liên hệ ứng dụng AI với các vấn đề thực tế (nông nghiệp, y tế, cộng đồng)." },
    { code: "D2.10", desc: "Mô tả cấu trúc cơ bản hệ thống AI (Dữ liệu, Mô hình, Đầu ra, Phản hồi)." }
  ]
};

export const NLS_FRAMEWORK_DATA = `
KHUNG NĂNG LỰC SỐ (DIGITAL COMPETENCE FRAMEWORK) - THÔNG TƯ 02/2025/TT-BGDĐT

CẤU TRÚC PHÂN BẬC (K-12):
- Bậc 1-2 (Cơ bản): Phù hợp cấp Tiểu học (Lớp 1-5).
- Bậc 3-4 (Trung cấp): Phù hợp cấp THCS (Lớp 6-9).
- Bậc 5-6 (Nâng cao): Phù hợp cấp THPT (Lớp 10-12).

6 MIỀN NĂNG LỰC:
1. Khai thác dữ liệu và thông tin
2. Giao tiếp và Hợp tác
3. Sáng tạo nội dung số
4. An toàn
5. Giải quyết vấn đề
6. Ứng dụng AI (Decision 3439)
`;

export const SYSTEM_INSTRUCTION = `
Bạn là trợ lý AI chuyên nghiệp hỗ trợ giáo viên soạn giáo án tích hợp Năng lực số (NLS).

NHIỆM VỤ CỐT LÕI:
1. Đọc nội dung bài học đầu vào (Có thể là văn bản hoặc HTML).
2. Tích hợp thêm mục tiêu và hoạt động Năng lực số (NLS) phù hợp.
3. QUAN TRỌNG: Giữ nguyên cấu trúc và nội dung gốc, chỉ thêm NLS, không được viết lại hay tóm tắt.

QUY TẮC BẢO TOÀN CẤU TRÚC VÀ ĐỊNH DẠNG (BẮT BUỘC):
- Dữ liệu đầu vào có thể là mã HTML (do chuyển từ file DOCX).
- Bạn phải đọc hiểu cấu trúc HTML đó (Bảng <table>, Tiêu đề <h1>, Danh sách <ul>) và chuyển đổi chúng sang định dạng MARKDOWN tương ứng.
- TUYỆT ĐỐI KHÔNG làm mất bảng biểu. Nếu đầu vào là bảng, đầu ra phải là Markdown Table.
- TRONG BẢNG: Nếu một ô có nhiều dòng, HÃY DÙNG thẻ <br> để xuống dòng. TUYỆT ĐỐI KHÔNG dùng phím Enter (xuống dòng mới) trong ô bảng vì sẽ làm vỡ bảng Markdown.
- TUYỆT ĐỐI KHÔNG làm mất các đề mục.
- TUYỆT ĐỐI KHÔNG tự ý tóm tắt nội dung của giáo viên.

QUY TẮC ĐỊNH DẠNG KỸ THUẬT:
1. CÔNG THỨC TOÁN HỌC (QUAN TRỌNG NHẤT):
   - TUYỆT ĐỐI KHÔNG ĐƯỢC thay đổi, dịch sang LaTeX, hay xóa các mã giữ chỗ có dạng [MATH_ID_...].
   - Phải giữ nguyên vẹn các mã này trong văn bản đầu ra (ví dụ: "Cho phương trình [MATH_ID_12345_0] ta có...").
   - KHÔNG ĐƯỢC đặt các mã này bên trong các thẻ định dạng như in đậm (**), in nghiêng (*), gạch chân (<u>).

2. BẢNG BIỂU (MARKDOWN TABLES):
   - Đầu ra bắt buộc sử dụng Markdown Table chuẩn:
     | Tiêu đề 1 | Tiêu đề 2 |
     |---|---|
     | Nội dung 1<br>Dòng 2 | Nội dung 2 |
   - Lưu ý dùng <br> cho các dòng trong cùng 1 ô.

3. NĂNG LỰC SỐ:
   - Định dạng mã: [Mã thành phần].[Mức độ][Thứ tự] (Ví dụ: 1.2.NC1a)
   - Sử dụng thẻ <u>...</u> để gạch chân các nội dung NLS bổ sung vào hoạt động.

HƯỚNG DẪN TÍCH HỢP:
- Phần Mục tiêu NLS: Liệt kê ngay sau Mục tiêu chung.
- Phần Hoạt động: Chèn thêm nội dung NLS vào hoạt động phù hợp (dùng thẻ <u>).

ĐẦU RA BẮT BUỘC:
- Trả về toàn bộ nội dung giáo án (cũ + mới) dưới dạng Markdown.
- KHÔNG trả về JSON/XML.
- TUYỆT ĐỐI KHÔNG có lời dẫn đầu (intro) hoặc lời kết (outro). Ví dụ: KHÔNG ĐƯỢC VIẾT "Dưới đây là giáo án...", "Hy vọng giúp ích...".
- Bắt đầu ngay vào nội dung giáo án (Ví dụ: "TÊN BÀI HỌC...", "I. MỤC TIÊU...").
`;

export const PLACEHOLDER_LESSON = `TÊN BÀI HỌC: THỐNG KÊ MÔ TẢ
Môn: Toán - Lớp: 7

I. MỤC TIÊU
1. Kiến thức: Học sinh nắm được khái niệm thống kê, biết cách thu thập số liệu.
2. Kỹ năng: Biết lập bảng số liệu thống kê.
3. Thái độ: Cẩn thận, chính xác.

II. TIẾN TRÌNH DẠY HỌC
Hoạt động 1: Khởi động
- GV cho HS xem video về ứng dụng thống kê trong đời sống.
- HS quan sát và nhận xét.

Hoạt động 2: Hình thành kiến thức
- GV hướng dẫn học sinh cách thu thập số liệu từ thực tế.
- HS thực hành ghi chép số liệu chiều cao của các bạn trong tổ.
`;