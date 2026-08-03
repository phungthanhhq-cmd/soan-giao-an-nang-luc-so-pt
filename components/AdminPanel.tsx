import React, { useState, useEffect } from 'react';
import { 
  listAllLinks, 
  createLink, 
  toggleLinkStatus, 
  deleteLink,
  isSimulationMode
} from '../services/firebase';
import { 
  Plus, 
  Copy, 
  Check, 
  Power, 
  Trash2, 
  UserCheck, 
  RefreshCw, 
  Clock, 
  HelpCircle,
  ExternalLink
} from 'lucide-react';

interface AdminPanelProps {
  adminEmail: string;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ adminEmail }) => {
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form Fields
  const [customCode, setCustomCode] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Copy state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchLinks = async () => {
    setLoading(true);
    setError(null);
    try {
      const allLinks = await listAllLinks();
      setLinks(allLinks || []);
    } catch (err: any) {
      console.error(err);
      setError('Không thể tải danh sách liên kết. Hãy kiểm tra cài đặt Firebase.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleGenerateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCode.trim()) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const cleanCode = customCode.trim().toLowerCase().replace(/[^a-z0-9_\-]/g, '');
    if (!cleanCode) {
      setError('Mã liên kết chỉ cho phép chữ cái thường, số, dấu - và _');
      setIsSubmitting(false);
      return;
    }

    try {
      await createLink(cleanCode, description, adminEmail);
      setSuccess(`Tạo thành công mã liên kết: ${cleanCode}`);
      setCustomCode('');
      setDescription('');
      fetchLinks();
    } catch (err: any) {
      setError(err?.message || 'Có lỗi xảy ra khi tạo liên kết.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (linkId: string, currentStatus: 'active' | 'revoked') => {
    try {
      setError(null);
      await toggleLinkStatus(linkId, currentStatus);
      fetchLinks();
      setSuccess('Cập nhật trạng thái thành công');
    } catch (err: any) {
      setError(err.message || 'Lỗi khi cập nhật trạng thái.');
    }
  };

  const handleDelete = async (linkId: string) => {
    let confirmed = true;
    try {
      confirmed = window.confirm(`Bạn có chắc muốn xóa mã liên kết '${linkId}'? Thao tác này KHÔNG THỂ khôi phục!`);
    } catch (e) {
      // If standard confirm is blocked in iframe sandbox, default to true so the admin is still functional
      confirmed = true;
    }
    if (!confirmed) return;

    try {
      setError(null);
      await deleteLink(linkId);
      setLinks(prev => prev.filter(l => l.id !== linkId));
      setSuccess('Đã xóa liên kết thành công');
    } catch (err: any) {
      setError(err.message || 'Lỗi khi xóa liên kết.');
    }
  };

  const generateRandomCode = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCustomCode(code);
  };

  const getInviteUrl = (code: string) => {
    let origin = window.location.origin + window.location.pathname;
    // Tự động chuyển đổi domain nội bộ nhà phát triển (-dev-) thành domain chia sẻ công khai (-pre-)
    if (origin.includes("-dev-")) {
      origin = origin.replace("-dev-", "-pre-");
    }
    return `${origin}?invite=${code}`;
  };

  const handleCopyLink = (code: string) => {
    const url = getInviteUrl(code);
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(code);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6 lg:p-8 space-y-8 animate-fadeIn">
      {/* Admin Panel Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 flex items-center">
            <span className="w-2.5 h-6 bg-indigo-600 rounded-full mr-3"></span>
            DANH SÁCH LIÊN KẾT BẢN QUYỀN
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Quản trị viên: <span className="font-semibold text-slate-700">{adminEmail}</span>
          </p>
        </div>
        <button
          onClick={fetchLinks}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50"
        >
          <RefreshCw size={14} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
          TẢI LẠI TRANG
        </button>
      </div>

      {/* Creation Form */}
      <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center">
          <Plus size={16} className="text-indigo-600 mr-2" />
          Tạo liên kết chia sẻ mới
        </h3>

        <form onSubmit={handleGenerateLink} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-4">
            <label className="block text-xs font-semibold text-slate-600 mb-2">
              Mã kích hoạt (custom code)
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                placeholder="Ví dụ: thanh-nien-thcs"
                className="w-full text-sm font-semibold bg-white border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <button
                type="button"
                onClick={generateRandomCode}
                className="px-3 bg-white border border-slate-200 hover:border-indigo-500 text-slate-500 hover:text-indigo-600 text-xs font-bold rounded-xl whitespace-nowrap transition-transform active:scale-95 shadow-sm"
              >
                Tạo ngẫu nhiên
              </button>
            </div>
          </div>

          <div className="md:col-span-5">
            <label className="block text-xs font-semibold text-slate-600 mb-2">
              Mô tả người sử dụng
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ví dụ: Giáo án THCS Lớp 6 - Thầy Hoàng"
              className="w-full text-xs bg-white border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="md:col-span-3">
            <button
              type="submit"
              disabled={isSubmitting || !customCode.trim()}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-indigo-600/10 active:scale-95"
            >
              {isSubmitting ? 'ĐANG TẠO...' : 'TẠO & COPPY'}
            </button>
          </div>
        </form>

        {error && <p className="text-xs font-semibold text-rose-500">{error}</p>}
        {success && <p className="text-xs font-semibold text-emerald-600">{success}</p>}
      </div>

      {/* Main Table / Links List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-20 text-center text-slate-400 space-y-2">
            <RefreshCw size={24} className="animate-spin mx-auto text-slate-300" />
            <p className="text-xs font-medium">Đang truy vấn cơ sở dữ liệu và tải liên kết...</p>
          </div>
        ) : links.length === 0 ? (
          <div className="border border-dashed border-slate-200 rounded-2xl p-10 text-center text-slate-400 space-y-2">
            <HelpCircle size={32} className="mx-auto text-slate-300 animate-bounce" />
            <p className="text-xs font-bold">Chưa có liên kết chia sẻ nào được tạo.</p>
            <p className="text-[10px] text-slate-400">Hãy nhập mã kích hoạt phía trên để tạo link đầu tiên.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-150">
            <table className="w-full min-w-[700px] border-collapse text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-150 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-4">Mã liên kết / URL</th>
                  <th className="px-6 py-4">Mô tả</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4">Tài khoản Google gán</th>
                  <th className="px-6 py-4">Ngày kích hoạt</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {links.map((link) => {
                  const isBound = !!link.boundToEmail;
                  const isRevoked = link.status === 'revoked';
                  const url = getInviteUrl(link.id);

                  return (
                    <tr key={link.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono font-semibold">
                        <div className="flex flex-col space-y-1">
                          <span className="text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px] w-max">
                            {link.id}
                          </span>
                          <span className="text-[10px] text-indigo-600 hover:underline cursor-pointer truncate max-w-[250px] flex items-center md:hidden lg:flex" onClick={() => handleCopyLink(link.id)}>
                            {url}
                            <ExternalLink size={10} className="ml-1 shrink-0" />
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-slate-800">{link.description || '—'}</span>
                      </td>
                      <td className="px-6 py-4">
                        {isRevoked ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-100">
                            Vô hiệu hóa
                          </span>
                        ) : isBound ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                            Đã kích hoạt
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-100 animate-pulse">
                            Được phép gán
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {isBound ? (
                          <span className="inline-flex items-center font-semibold text-slate-900 bg-indigo-50/50 px-2 py-1 rounded-lg">
                            <UserCheck size={12} className="text-indigo-600 mr-1 shrink-0" />
                            {link.boundToEmail}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Đang chờ gán...</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-400 font-mono text-[11px]">
                        {link.boundAt ? (
                          <span className="flex items-center">
                            <Clock size={11} className="mr-1" />
                            {new Date(link.boundAt).toLocaleDateString()}
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleCopyLink(link.id)}
                            className="p-1.5 hover:bg-indigo-50 text-indigo-600 rounded-lg transition-colors border border-indigo-100 shadow-sm"
                            title="Sao chép link chia sẻ"
                          >
                            {copiedId === link.id ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                          </button>
                          
                          <button
                            onClick={() => handleToggleStatus(link.id, link.status)}
                            className={`p-1.5 rounded-lg border shadow-sm transition-colors ${
                              isRevoked 
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100' 
                                : 'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100'
                            }`}
                            title={isRevoked ? 'Kích hoạt lại liên kết' : 'Tạm vô hiệu hóa'}
                          >
                            <Power size={14} />
                          </button>

                          <button
                            onClick={() => handleDelete(link.id)}
                            className="p-1.5 bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 rounded-lg transition-all"
                            title="Xóa vĩnh viễn"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
