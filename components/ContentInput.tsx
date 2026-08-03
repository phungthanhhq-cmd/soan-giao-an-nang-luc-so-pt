import React, { useRef, useState } from 'react';
import { Loader2, CheckCircle2, FileText, Upload, AlertTriangle, FileBarChart } from 'lucide-react';
import JSZip from 'jszip';

interface ContentInputProps {
  lessonContent: string;
  setLessonContent: (val: string) => void;
  distributionContent: string;
  setDistributionContent: (val: string) => void;
  setMathMap: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

// Khai báo thư viện ngoại
declare const mammoth: any;
declare const pdfjsLib: any;

const ContentInput: React.FC<ContentInputProps> = ({ 
  lessonContent, 
  setLessonContent,
  distributionContent,
  setDistributionContent,
  setMathMap
}) => {
  const lessonInputRef = useRef<HTMLInputElement>(null);
  const distInputRef = useRef<HTMLInputElement>(null);
  
  const [processingLesson, setProcessingLesson] = useState(false);
  const [processingDist, setProcessingDist] = useState(false);
  
  const [lessonFileName, setLessonFileName] = useState<string | null>(null);
  const [distFileName, setDistFileName] = useState<string | null>(null);

  const processFile = async (file: File, isLesson: boolean) => {
    const setProcessing = isLesson ? setProcessingLesson : setProcessingDist;
    const setContent = isLesson ? setLessonContent : setDistributionContent;
    const setFileName = isLesson ? setLessonFileName : setDistFileName;

    setProcessing(true);
    setFileName(file.name);
    
    // Clear math map when a new lesson file is uploaded
    if (isLesson) {
      setMathMap({});
    }
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      let text = "";

      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        text = await extractTextFromPDF(arrayBuffer);
      } else if (
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || 
        file.name.endsWith(".docx")
      ) {
        text = await extractTextFromDOCX(arrayBuffer);
      } else {
        alert("Định dạng file không được hỗ trợ. Vui lòng chọn PDF hoặc DOCX.");
        setFileName(null);
        setProcessing(false);
        return;
      }

      if (!text.trim()) {
        alert("Không thể đọc được nội dung văn bản từ file này. Có thể file chứa ảnh scan?");
        setFileName(null);
      } else {
        setContent(text);
      }

    } catch (error) {
      console.error("Error processing file:", error);
      alert("Có lỗi xảy ra khi đọc file.");
      setFileName(null);
    } finally {
      setProcessing(false);
    }
  };

  const preprocessDOCXMath = async (arrayBuffer: ArrayBuffer): Promise<ArrayBuffer> => {
    try {
      const zip = await JSZip.loadAsync(arrayBuffer);
      const docXmlFile = zip.file("word/document.xml");
      if (!docXmlFile) return arrayBuffer;

      let xml = await docXmlFile.async("string");
      let mathCounter = 0;
      const timestamp = Date.now();
      const newMathMap: Record<string, string> = {};

      // Replace OMML math blocks with plain text wrapped in [MATH_ID_X]
      xml = xml.replace(/<m:oMath[^>]*>([\s\S]*?)<\/m:oMath>/g, (match) => {
        const mathId = `MATH_ID_${timestamp}_${mathCounter++}`;
        newMathMap[mathId] = match; // Store the original OMML XML
        return `<w:r><w:t xml:space="preserve">[${mathId}]</w:t></w:r>`;
      });

      if (Object.keys(newMathMap).length > 0) {
        setMathMap(prev => ({ ...prev, ...newMathMap }));
      }

      zip.file("word/document.xml", xml);
      return await zip.generateAsync({ type: "arraybuffer" });
    } catch (e) {
      console.error("Error preprocessing DOCX math:", e);
      return arrayBuffer; // fallback to original if error
    }
  };

  const extractTextFromDOCX = async (arrayBuffer: ArrayBuffer): Promise<string> => {
    if (typeof mammoth === 'undefined') return "";
    try {
        // Preprocess to extract math formulas before mammoth ignores them
        const processedBuffer = await preprocessDOCXMath(arrayBuffer);

        // Use convertToHtml to preserve structure (tables, headers) instead of raw text
        const result = await mammoth.convertToHtml({ arrayBuffer: processedBuffer });
        let html = result.value;
        
        // Remove heavy base64 images to prevent context overload/lag for the AI
        // We replace them with a placeholder text so the user knows an image was there
        html = html.replace(/<img[^>]*src="data:image\/[^;]+;base64,[^"]+"[^>]*>/g, ' [HÌNH ẢNH ĐÃ LƯỢC BỎ] ');
        
        return html;
    } catch (e) {
        console.error("Mammoth error", e);
        return "";
    }
  };

  const extractTextFromPDF = async (arrayBuffer: ArrayBuffer): Promise<string> => {
    if (typeof pdfjsLib === 'undefined') return "";
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(" ");
      fullText += pageText + "\n\n";
    }
    return fullText;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isLesson: boolean) => {
    const file = e.target.files?.[0];
    if (file) processFile(file, isLesson);
    e.target.value = '';
  };

  // Component hiển thị ô upload
  const UploadBox = ({ 
    title, 
    subTitle, 
    inputRef, 
    fileName, 
    isProcessing, 
    isLesson,
    hasContent
  }: { 
    title: string, 
    subTitle: string, 
    inputRef: React.RefObject<HTMLInputElement | null>, 
    fileName: string | null, 
    isProcessing: boolean, 
    isLesson: boolean,
    hasContent: boolean
  }) => (
    <div 
      onClick={() => inputRef.current?.click()}
      className={`group relative overflow-hidden rounded-2xl border-2 border-dashed p-8 transition-all duration-300 cursor-pointer text-center
        ${hasContent 
            ? 'border-emerald-300 bg-emerald-50/50 hover:bg-emerald-50' 
            : 'border-slate-300 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50/30'
        }
      `}
    >
      <input 
        type="file" 
        ref={inputRef}
        onChange={(e) => handleFileChange(e, isLesson)}
        accept=".pdf,.docx" 
        className="hidden" 
      />
      
      <div className="flex flex-col items-center justify-center relative z-10">
        {isProcessing ? (
           <div className="p-4 bg-white rounded-full shadow-lg mb-3">
               <Loader2 className="text-indigo-600 animate-spin" size={32} />
           </div>
        ) : hasContent ? (
           <div className="p-4 bg-white rounded-full shadow-lg shadow-emerald-200 mb-3">
             <CheckCircle2 className="text-emerald-500" size={32} />
           </div>
        ) : (
          <div className={`p-4 rounded-full shadow-lg mb-4 transition-transform group-hover:-translate-y-1
              ${isLesson ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-white text-slate-400 border border-slate-100'}`}
          >
             {isLesson ? <FileText size={28} /> : <FileBarChart size={28} />}
          </div>
        )}

        {isProcessing ? (
             <p className="text-sm font-semibold text-slate-600 animate-pulse">Đang phân tích...</p>
        ) : hasContent ? (
            <>
                <p className="text-sm font-bold text-emerald-800 break-all px-2 line-clamp-1">{fileName}</p>
                <p className="text-xs font-medium text-emerald-600 mt-1 bg-emerald-100 px-3 py-1 rounded-full">Đã sẵn sàng</p>
            </>
        ) : (
            <>
                <p className="text-base font-bold text-slate-700">{title}</p>
                <p className="text-xs text-slate-500 mt-2 max-w-[200px] mx-auto leading-relaxed">{subTitle}</p>
                <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-indigo-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    <Upload size={12} />
                    <span>Bấm để chọn file</span>
                </div>
            </>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 p-8 border border-white/50 backdrop-blur-sm mt-6">
      <div className="flex items-center mb-6">
        <div className="p-2 bg-indigo-50 rounded-lg mr-3">
            <Upload size={20} className="text-indigo-600"/>
        </div>
        <h2 className="text-xl font-bold text-slate-800">Tài liệu đầu vào</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ô Upload Giáo án */}
        <div className="flex flex-col h-full">
            <UploadBox 
                title="Tải lên Giáo án chưa tích hợp" 
                subTitle="Hỗ trợ file Word (.docx) hoặc PDF. Bản đẹp, không phải bản scan." 
                inputRef={lessonInputRef}
                fileName={lessonFileName}
                isProcessing={processingLesson}
                isLesson={true}
                hasContent={!!lessonContent}
            />
             {!lessonContent && (
                <div className="flex items-center justify-center mt-3 text-rose-500 text-xs font-medium">
                    <AlertTriangle size={12} className="mr-1.5"/>
                    <span>Yêu cầu bắt buộc</span>
                </div>
            )}
        </div>

        {/* Ô Upload PPCT */}
        <div className="flex flex-col h-full">
            <UploadBox 
                title="Tải lên PPCT" 
                subTitle="Dùng để trích xuất chính xác năng lực theo quy định nhà trường." 
                inputRef={distInputRef}
                fileName={distFileName}
                isProcessing={processingDist}
                isLesson={false}
                hasContent={!!distributionContent}
            />
        </div>
      </div>
    </div>
  );
};

export default ContentInput;