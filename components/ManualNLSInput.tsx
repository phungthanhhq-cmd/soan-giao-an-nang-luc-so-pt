import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Target, Info, Zap, ChevronDown, Check, CheckSquare, Square } from 'lucide-react';
import { NLS_COMPONENT_OPTIONS, NLS_LEVEL_DETAILS, AI_GRADE_REQUIREMENTS } from '../constants';
import { ManualNLSEntry, SchoolLevel } from '../types';

interface ManualNLSInputProps {
  entries: ManualNLSEntry[];
  setEntries: (entries: ManualNLSEntry[]) => void;
  schoolLevel: SchoolLevel;
  grade: number;
}

const ManualNLSInput: React.FC<ManualNLSInputProps> = ({ entries, setEntries, schoolLevel, grade }) => {
  const [selectedCode, setSelectedCode] = useState<string>(NLS_COMPONENT_OPTIONS[0].code);
  const [targetProficiencyLevel, setTargetProficiencyLevel] = useState<number>(schoolLevel === SchoolLevel.TH ? 1 : schoolLevel === SchoolLevel.THCS ? 3 : 5);
  const [description, setDescription] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update level selection when schoolLevel changes
  useEffect(() => {
    const defaultLevel = schoolLevel === SchoolLevel.TH ? 1 : schoolLevel === SchoolLevel.THCS ? 3 : 5;
    setTargetProficiencyLevel(defaultLevel);
  }, [schoolLevel]);

  // Reset description when domain or level changes
  useEffect(() => {
    setDescription("");
  }, [selectedCode, targetProficiencyLevel]);

  const handleAddCustom = () => {
    if (!description.trim()) {
      alert("Vui lòng nhập nội dung năng lực.");
      return;
    }

    const component = NLS_COMPONENT_OPTIONS.find(opt => opt.code === selectedCode);
    const newEntry: ManualNLSEntry = {
      id: Date.now().toString() + '_' + Math.random().toString(36).substring(2, 6),
      code: selectedCode,
      name: component ? component.label : selectedCode,
      description: description.trim()
    };

    setEntries([...entries, newEntry]);
    setDescription(""); 
  };

  const handleRemove = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  // Map numbers to desired display codes
  const proficiencyLabels: Record<number, string> = {
    1: "CB1",
    2: "BC1",
    3: "TC1",
    4: "TC2",
    5: "NC1",
    6: "NC2"
  };

  // Get all potential options for the selected component
  const allLevelsForComponent = NLS_LEVEL_DETAILS[selectedCode] || [];
  const aiRequirements = selectedCode.startsWith("6") ? (AI_GRADE_REQUIREMENTS[grade] || []) : [];
  
  // Filter Codes based on selected "Bậc" (proficiency level)
  const codesByLevel = allLevelsForComponent.filter(lvl => lvl.level === targetProficiencyLevel);

  // Combine available codes
  const availableCodesList: { code: string; desc: string }[] = [];
  if (selectedCode.startsWith("6") && aiRequirements.length > 0) {
    aiRequirements.forEach(req => availableCodesList.push({ code: req.code, desc: req.desc }));
  }
  codesByLevel.forEach(lvl => {
    if (!availableCodesList.some(item => item.code === lvl.code)) {
      availableCodesList.push({ code: lvl.code, desc: lvl.desc });
    }
  });

  const isCodeChecked = (code: string) => entries.some(e => e.code === code);

  const toggleCode = (codeItem: { code: string; desc: string }) => {
    const component = NLS_COMPONENT_OPTIONS.find(opt => opt.code === selectedCode);
    if (isCodeChecked(codeItem.code)) {
      setEntries(entries.filter(e => e.code !== codeItem.code));
    } else {
      const newEntry: ManualNLSEntry = {
        id: Date.now().toString() + '_' + Math.random().toString(36).substring(2, 6),
        code: codeItem.code,
        name: component ? component.label : selectedCode,
        description: codeItem.desc
      };
      setEntries([...entries, newEntry]);
      setDescription(codeItem.desc);
    }
  };

  const handleSelectAll = () => {
    const component = NLS_COMPONENT_OPTIONS.find(opt => opt.code === selectedCode);
    const updatedEntries = [...entries];
    availableCodesList.forEach(item => {
      if (!updatedEntries.some(e => e.code === item.code)) {
        updatedEntries.push({
          id: Date.now().toString() + '_' + Math.random().toString(36).substring(2, 6),
          code: item.code,
          name: component ? component.label : selectedCode,
          description: item.desc
        });
      }
    });
    setEntries(updatedEntries);
  };

  const handleDeselectAll = () => {
    const codeSet = new Set(availableCodesList.map(c => c.code));
    setEntries(entries.filter(e => !codeSet.has(e.code)));
  };

  // Suggested levels display logic
  const suggestedLevels = schoolLevel === SchoolLevel.TH ? [1, 2] : 
                         schoolLevel === SchoolLevel.THCS ? [3, 4] : [5, 6];

  const checkedCountInCurrent = availableCodesList.filter(item => isCodeChecked(item.code)).length;

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 p-8 border border-white/50 backdrop-blur-sm mt-6">
      <div className="flex items-center mb-6">
        <div className="p-3 bg-indigo-100 rounded-2xl mr-4">
          <Target size={24} className="text-indigo-600" />
        </div>
        <div>
           <h2 className="text-xl font-bold text-slate-800">Yêu cầu Năng lực số áp dụng</h2>
           <p className="text-xs text-slate-500">Chuẩn Thông tư 02 & QĐ 3439: {schoolLevel} - Lớp {grade}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        
        {/* Dropdown 1: Miền năng lực */}
        <div className="lg:col-span-1">
           <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase ml-1">1. Miền Năng lực</label>
           <select
             value={selectedCode}
             onChange={(e) => setSelectedCode(e.target.value)}
             className="block w-full rounded-xl border-0 bg-slate-50 py-2.5 px-3 text-slate-700 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-xs font-medium transition-shadow cursor-pointer hover:bg-slate-100"
           >
             {NLS_COMPONENT_OPTIONS.map((opt) => (
               <option key={opt.code} value={opt.code}>{opt.label}</option>
             ))}
           </select>
        </div>

        {/* Dropdown 2: Mức độ (Bậc) */}
        <div className="lg:col-span-1">
           <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase ml-1">2. Mức độ</label>
           <select
             value={targetProficiencyLevel}
             onChange={(e) => setTargetProficiencyLevel(parseInt(e.target.value))}
             className="block w-full rounded-xl border-0 bg-slate-50 py-2.5 px-3 text-slate-700 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-xs font-medium transition-shadow cursor-pointer hover:bg-slate-100"
           >
             {[1, 2, 3, 4, 5, 6].map(b => (
               <option key={b} value={b}>{proficiencyLabels[b]} { suggestedLevels.includes(b) ? " (Gợi ý)" : "" }</option>
             ))}
           </select>
        </div>

        {/* Multi-Select Dropdown 3: Mã tích hợp */}
        <div className="lg:col-span-1 relative" ref={dropdownRef}>
           <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase ml-1 flex justify-between items-center">
             <span>3. Mã Tích hợp</span>
             {checkedCountInCurrent > 0 && (
               <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded-full">
                 Đã chọn {checkedCountInCurrent}/{availableCodesList.length}
               </span>
             )}
           </label>

           <button
             type="button"
             onClick={() => setIsDropdownOpen(!isDropdownOpen)}
             className="w-full rounded-xl border-0 bg-slate-50 py-2.5 px-3 text-slate-700 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-xs font-medium transition-all hover:bg-slate-100 flex items-center justify-between cursor-pointer"
           >
             <span className="truncate text-left font-medium">
               {availableCodesList.length === 0
                 ? "Không có mã"
                 : checkedCountInCurrent === 0
                 ? "-- Chọn mã (tích nhiều) --"
                 : `Đã tích ${checkedCountInCurrent} mã`}
             </span>
             <ChevronDown size={14} className={`text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180 text-indigo-600' : ''}`} />
           </button>

           {/* Popup menu with checkboxes */}
           {isDropdownOpen && (
             <div className="absolute z-30 top-full left-0 mt-1 w-72 md:w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 p-3 text-xs space-y-2 max-h-72 overflow-y-auto">
               <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                 <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">
                   Chuẩn NLS [{proficiencyLabels[targetProficiencyLevel]}]
                 </span>
                 <div className="flex gap-2">
                   <button
                     type="button"
                     onClick={handleSelectAll}
                     className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded-lg transition-colors"
                   >
                     Chọn tất cả
                   </button>
                   <button
                     type="button"
                     onClick={handleDeselectAll}
                     className="text-[10px] font-bold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-lg transition-colors"
                   >
                     Bỏ chọn
                   </button>
                 </div>
               </div>

               {availableCodesList.length === 0 ? (
                 <p className="text-slate-400 italic py-2 text-center">Không có mã nào ở mức độ này</p>
               ) : (
                 <div className="space-y-1">
                   {availableCodesList.map((item) => {
                     const checked = isCodeChecked(item.code);
                     return (
                       <label
                         key={item.code}
                         className={`flex items-start gap-2.5 p-2 rounded-xl cursor-pointer transition-colors ${
                           checked ? 'bg-indigo-50/80 border border-indigo-200' : 'hover:bg-slate-50 border border-transparent'
                         }`}
                       >
                         <input
                           type="checkbox"
                           checked={checked}
                           onChange={() => toggleCode(item)}
                           className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                         />
                         <div className="flex-1 min-w-0">
                           <div className="flex items-center gap-1.5 mb-0.5">
                             <span className={`font-bold px-1.5 py-0.5 rounded text-[11px] ${
                               checked ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'
                             }`}>
                               {item.code}
                             </span>
                           </div>
                           <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">
                             {item.desc}
                           </p>
                         </div>
                       </label>
                     );
                   })}
                 </div>
               )}
             </div>
           )}
        </div>

        {/* Input Description & Add Button */}
        <div className="lg:col-span-2">
           <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase ml-1">4. Nội dung cụ thể (tùy chỉnh)</label>
           <div className="flex gap-2">
             <textarea
               value={description}
               onChange={(e) => setDescription(e.target.value)}
               placeholder="Mô tả cụ thể hoặc chọn Mã ở trên..."
               rows={1}
               className="block w-full rounded-xl border-0 bg-slate-50 py-2 px-3 text-slate-700 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-xs transition-shadow resize-none h-[38px] flex items-center"
             />
             <button
               onClick={handleAddCustom}
               disabled={!description.trim()}
               className="bg-indigo-600 text-white w-[38px] h-[38px] rounded-xl hover:bg-indigo-700 transition-colors shadow-md disabled:bg-slate-300 disabled:shadow-none flex items-center justify-center flex-shrink-0"
               title="Thêm yêu cầu tùy chỉnh"
             >
               <Plus size={18} />
             </button>
           </div>
        </div>

      </div>

      {/* Selected Items List */}
      <div className="mt-8 space-y-3">
        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
             <Info className="text-slate-300 mb-2" size={24} />
             <p className="text-slate-400 text-sm italic">Chưa chọn yêu cầu NLS cụ thể. Bạn có thể tích chọn nhiều mã ở mục 3 ở trên.</p>
          </div>
        ) : (
          entries.map((entry) => (
            <div 
              key={entry.id} 
              className="group flex items-start justify-between bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100 p-4 rounded-2xl transition-all duration-200"
            >
              <div className="flex items-start">
                <div className="mt-1 p-1 bg-indigo-600 rounded-lg mr-3 shadow-sm group-hover:scale-110 transition-transform">
                   <Zap className="text-white fill-current" size={14} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold bg-indigo-200 text-indigo-700 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {entry.code}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {entry.name}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">{entry.description}</p>
                </div>
              </div>
              <button 
                onClick={() => handleRemove(entry.id)}
                className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-xl transition-all ml-4"
                title="Xóa mã này"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManualNLSInput;