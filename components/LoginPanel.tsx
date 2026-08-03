import React, { useState } from 'react';
import { loginWithGooglePopup, loginWithSimulatedEmail, isSimulationMode } from '../services/firebase';
import { Sparkles, ArrowRight, ShieldAlert, LogIn, ExternalLink, Mail, ShieldCheck, UserCheck } from 'lucide-react';

interface LoginPanelProps {
  onLoginSuccess: (user: any) => void;
  isLoading: boolean;
  setIsLoading: (val: boolean) => void;
}

const LoginPanel: React.FC<LoginPanelProps> = ({ onLoginSuccess, isLoading, setIsLoading }) => {
  const [error, setError] = useState<string | null>(null);
  const [emailInput, setEmailInput] = useState<string>('phungthanhhq@gmail.com');
  const [showOtherAccountOptions, setShowOtherAccountOptions] = useState<boolean>(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await loginWithGooglePopup();
      if (user) {
        onLoginSuccess(user);
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Đã xảy ra lỗi khi đăng nhập bằng Google. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimulatedLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !emailInput.includes('@')) {
      setError('Định dạng Email Google không hợp lệ!');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const user = await loginWithSimulatedEmail(emailInput.trim());
      if (user) {
        onLoginSuccess(user);
      }
    } catch (err: any) {
      setError(err.message || 'Lỗi giả lập đăng nhập.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSelect = async (quickEmail: string) => {
    setEmailInput(quickEmail);
    setIsLoading(true);
    setError(null);
    try {
      const user = await loginWithSimulatedEmail(quickEmail);
      if (user) {
        onLoginSuccess(user);
      }
    } catch (err: any) {
      setError(err.message || 'Lỗi giả lập đăng nhập nhanh.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-sans flex items-center justify-center p-6 bg-slate-50 relative overflow-hidden">
      {/* Dynamic Background Blurs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] bg-indigo-200/40 rounded-full blur-[100px] mix-blend-multiply filter opacity-70"></div>
        <div className="absolute bottom-[20%] right-[20%] w-[40%] h-[40%] bg-purple-200/40 rounded-full blur-[100px] mix-blend-multiply filter opacity-70"></div>
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200/80 p-8 relative z-10 transition-transform duration-500 hover:shadow-2xl">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center">
          <div className="h-16 w-16 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-md mb-5 transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <span className="text-white font-extrabold text-2xl tracking-wider">PT</span>
          </div>
          
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-700">
            SOẠN GIÁO ÁN NLS-PT
          </h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">
            Công cụ AI tích hợp Năng lực số chuẩn giáo án giaoviendoimoi.com
          </p>
        </div>

        {/* Informative description */}
        <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 my-6">
          <p className="text-xs text-indigo-900 leading-relaxed text-center font-medium">
            Để bảo vệ bản quyền phần mềm, hệ thống yêu cầu xác thực tài khoản Google trước khi sử dụng.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-xs text-rose-700 font-medium">
            {error}
          </div>
        )}

        {/* Unified Authentication Panel */}
        <div className="space-y-4">
          {/* Main Login Trigger */}
          <button
            onClick={isSimulationMode ? () => handleQuickSelect('phungthanhhq@gmail.com') : handleGoogleLogin}
            disabled={isLoading}
            className="w-full py-4 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold flex items-center justify-center space-x-3 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg group disabled:bg-slate-400 disabled:transform-none select-none"
          >
            {isLoading ? (
              <span className="text-sm">Đang kết nối tài khoản Google...</span>
            ) : (
              <>
                <svg className="w-5 h-5 bg-white rounded p-0.5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.61c-.29 1.5-.1.1.1-1.12c1.04-.69 2-1.28 2-2.05v1.73c0 .54-.2 1.05-.53 1.45L23.75 12.27z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.91-3.03c-1.07.72-2.45 1.16-4.05 1.16-3.11 0-5.74-2.11-6.68-4.96L1.31 17.37C3.29 21.29 7.32 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.32 14.26a7.14 7.14 0 0 1 0-4.52L1.31 6.63a11.94 11.94 0 0 0 0 10.74l4.01-3.11z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.32 0 3.29 2.71 1.31 6.63l4.01 3.11C6.26 6.86 8.89 4.75 12 4.75z"
                  />
                </svg>
                <span className="uppercase tracking-wide">ĐĂNG NHẬP VỚI GOOGLE</span>
                <ArrowRight size={18} className="text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </>
            )}
          </button>

          {/* Interactive Button to sign-in with another Google account */}
          <button
            type="button"
            onClick={() => {
              setShowOtherAccountOptions(!showOtherAccountOptions);
              if (!isSimulationMode) {
                // In production mode, clicking this also forces Google Auth pop-up with select_account
                handleGoogleLogin();
              }
            }}
            disabled={isLoading}
            className="w-full py-3 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-indigo-600 rounded-2xl font-bold text-xs tracking-wide transition-all select-none flex items-center justify-center space-x-2 shadow-xs active:scale-95 disabled:opacity-50"
          >
            <Mail className="w-4 h-4 text-slate-400" />
            <span>ĐĂNG NHẬP BẰNG TÀI KHOẢN GOOGLE KHÁC</span>
          </button>

          {/* Collapsible Panel for typing a custom Google account / Simulation mode */}
          {showOtherAccountOptions && (
            <div className="mt-4 p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 animate-fadeIn">
              {isSimulationMode && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-emerald-900">
                  <div className="flex items-center text-[10px] font-extrabold text-amber-800 mb-1 leading-none">
                    <ShieldAlert size={12} className="mr-1 shrink-0" />
                    CHỈ DẪN KIỂM THỬ KHÔNG CẦN POP-UP
                  </div>
                  <p className="text-[10px] text-amber-700 leading-normal">
                    Để kiểm thử thuận tiện bên trong Khung IFrame của AI Studio (nơi trình duyệt chặn các popup đè lên), quý thầy cô có thể tự do nhập hoặc click chọn Email Google bất kỳ bên dưới:
                  </p>
                </div>
              )}

              <form onSubmit={handleSimulatedLogin} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
                    Địa chỉ Email Google muốn gán:
                  </label>
                  <div className="relative rounded-xl shadow-xs">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="teacher-email@gmail.com"
                      disabled={isLoading}
                      className="block w-full pl-9 pr-3 py-2.5 text-xs font-semibold bg-white border border-slate-200 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl transition-all"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs tracking-wider transition-all shadow-xs flex items-center justify-center space-x-1.5 disabled:bg-slate-300"
                >
                  <LogIn size={13} />
                  <span>XÁC NHẬN ĐĂNG NHẬP KHÁC</span>
                </button>
              </form>

              {isSimulationMode && (
                <div className="pt-2 border-t border-slate-150">
                  <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider text-center mb-2">
                    Nhấp chọn tài khoản nhanh:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickSelect('phungthanhhq@gmail.com')}
                      disabled={isLoading}
                      className="flex flex-col items-center justify-center p-2.5 border border-indigo-100/50 bg-indigo-50/20 hover:bg-indigo-50/50 hover:border-indigo-200 rounded-xl transition-all"
                    >
                      <ShieldCheck size={14} className="text-indigo-600 mb-0.5" />
                      <span className="text-[10px] font-bold text-slate-800">Quản trị viên</span>
                      <span className="text-[8px] text-slate-400">phungthanhhq@...</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickSelect('giaovien@gmail.com')}
                      disabled={isLoading}
                      className="flex flex-col items-center justify-center p-2.5 border border-slate-150 bg-white hover:bg-slate-50 hover:border-slate-300 rounded-xl transition-all"
                    >
                      <UserCheck size={14} className="text-slate-500 mb-0.5" />
                      <span className="text-[10px] font-bold text-slate-800">Giáo viên</span>
                      <span className="text-[8px] text-slate-400">giaovien@...</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-150 text-center text-xs text-slate-400 font-medium flex flex-col items-center">
          <span>Sản phẩm phát triển bởi phungthanhAI</span>
          <span className="mt-1 text-slate-300">© 2026 Toàn bộ bản quyền được bảo hộ</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPanel;
