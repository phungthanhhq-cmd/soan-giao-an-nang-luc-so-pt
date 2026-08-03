import React, { useEffect } from 'react';
import { Subject, Textbook, SchoolLevel } from '../types';
import { LayoutDashboard, Book, Layers, GraduationCap } from 'lucide-react';

interface LessonFormProps {
  textbook: Textbook;
  setTextbook: (val: Textbook) => void;
  schoolLevel: SchoolLevel;
  setSchoolLevel: (val: SchoolLevel) => void;
  subject: Subject;
  setSubject: (val: Subject) => void;
  grade: number;
  setGrade: (val: number) => void;
}

const LessonForm: React.FC<LessonFormProps> = ({
  textbook,
  setTextbook,
  schoolLevel,
  setSchoolLevel,
  subject,
  setSubject,
  grade,
  setGrade,
}) => {
  // Helper for select arrow styling
  const selectClass = "appearance-none block w-full rounded-xl border-0 bg-slate-50 py-3.5 px-4 text-slate-700 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-shadow cursor-pointer font-medium hover:bg-slate-100";

  // Grades based on school level
  const levelGrades: Record<SchoolLevel, number[]> = {
    [SchoolLevel.TH]: [1, 2, 3, 4, 5],
    [SchoolLevel.THCS]: [6, 7, 8, 9],
    [SchoolLevel.THPT]: [10, 11, 12]
  };

  const gradeOptions = levelGrades[schoolLevel];

  const primarySubjects = [
    Subject.TAT_CA,
    Subject.TIENG_VIET,
    Subject.TOAN,
    Subject.NGOAI_NGU_1,
    Subject.GD_LOI_SONG,
    Subject.DAO_DUC,
    Subject.TN_XH,
    Subject.LS_DL,
    Subject.KHOA_HOC,
    Subject.TIN_CONG_NGHE,
    Subject.GD_THE_CHAT,
    Subject.NQTN,
    Subject.TIENG_DT_THIEU_SO,
    Subject.KHAC
  ];

  const secondarySubjects = [
    Subject.TIN,
    Subject.TOAN,
    Subject.VAN,
    Subject.LY,
    Subject.HOA,
    Subject.SINH,
    Subject.ANH,
    Subject.SU,
    Subject.DIA,
    Subject.GDCD,
    Subject.CONG_NGHE,
    Subject.THE_DUC,
    Subject.NQTN,
    Subject.HDKH,
    Subject.KHAC
  ];

  const isPrimary = grade >= 1 && grade <= 5;
  const currentSubjects = isPrimary ? primarySubjects : secondarySubjects;

  // Ensure grade is valid for level
  useEffect(() => {
    if (!gradeOptions.includes(grade)) {
      setGrade(gradeOptions[0]);
    }
  }, [schoolLevel, gradeOptions, grade, setGrade]);

  useEffect(() => {
    if (!currentSubjects.includes(subject)) {
      setSubject(currentSubjects[0]);
    }
  }, [grade, subject, currentSubjects, setSubject]);

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 p-8 border border-white/50 backdrop-blur-sm relative overflow-hidden">
       {/* Decorative accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
        <LayoutDashboard className="mr-2 text-indigo-500" size={24} />
        Thông tin bài dạy
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Textbook */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Bộ sách</label>
          <div className="relative">
            <select
              value={textbook}
              onChange={(e) => setTextbook(e.target.value as Textbook)}
              className={selectClass}
            >
              {Object.values(Textbook).map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-indigo-600">
               <Book size={16} />
            </div>
          </div>
        </div>

        {/* School Level */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Cấp học</label>
          <div className="relative">
            <select
              value={schoolLevel}
              onChange={(e) => setSchoolLevel(e.target.value as SchoolLevel)}
              className={selectClass}
            >
              {Object.values(SchoolLevel).map((level) => (
                <option key={level} value={level}>{level === SchoolLevel.TH ? "Tiểu học (TH)" : level === SchoolLevel.THCS ? "Trung học cơ sở (THCS)" : "Trung học phổ thông (THPT)"}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-emerald-600">
              <GraduationCap size={16} />
            </div>
          </div>
        </div>

        {/* Grade */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Khối lớp</label>
          <div className="relative">
            <select
              value={grade}
              onChange={(e) => setGrade(Number(e.target.value))}
              className={selectClass}
            >
              {gradeOptions.map((g) => (
                <option key={g} value={g}>Lớp {g}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-pink-600">
              <Layers size={16} />
            </div>
          </div>
        </div>

        {/* Subject */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Môn học</label>
          <div className="relative">
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value as Subject)}
              className={selectClass}
            >
              {currentSubjects.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-purple-600">
               {/* Just a decorative dot or icon */}
               <div className="w-2 h-2 rounded-full bg-current"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonForm;