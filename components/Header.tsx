import React from 'react';

interface HeaderProps {
  onOpenApiKeyModal?: () => void;
  apiKeySet?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onOpenApiKeyModal, apiKeySet }) => {
  return (
    <header className="sticky top-0 z-40 bg-blue-600 text-white shadow-md border-b border-blue-500/50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* App Title */}
        <div className="flex flex-col justify-center">
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
            SOẠN GIÁO ÁN NLS-PT
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 font-medium opacity-90">
            App được tạo và phát triển bởi Phùng Thanh AI
          </p>
        </div>

        {/* Action Pills matching user's image */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenApiKeyModal}
            className={`px-4 py-2 text-amber-200 rounded-xl font-bold text-xs sm:text-sm flex items-center space-x-2 transition-all shadow-xs active:scale-95 cursor-pointer ${
              apiKeySet
                ? "bg-blue-500/90 hover:bg-blue-500 border border-emerald-300/60"
                : "bg-blue-500/80 hover:bg-blue-500 border border-blue-400/60"
            }`}
            title="Bấm để lấy hoặc nhập API Key Gemini"
          >
            <span className="text-amber-300">🔑</span>
            <span>{apiKeySet ? "API key đã thiết lập (Đổi API key)" : "Lấy API key để sử dụng app"}</span>
            <span className="text-blue-200 text-xs">⚙️</span>
          </button>

          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-700/60 hover:bg-blue-700 text-blue-100 hover:text-white rounded-xl font-bold text-xs sm:text-sm flex items-center space-x-2 border border-blue-500/40 transition-all shadow-xs active:scale-95 cursor-pointer"
            title="Bấm để mở trang tạo API Key Gemini riêng miễn phí từ Google"
          >
            <span>📖</span>
            <span>Lấy API ở đây</span>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
