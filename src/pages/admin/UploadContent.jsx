import { useState, useRef } from 'react';
import { HiOutlineDocumentText, HiOutlineFilm, HiOutlineTrash, HiOutlineCheckCircle, HiOutlinePhotograph } from 'react-icons/hi';

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

function getFileType(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(ext)) return 'video';
  if (['pdf'].includes(ext)) return 'pdf';
  if (['pptx', 'ppt'].includes(ext)) return 'ppt';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return 'image';
  return 'document';
}

function getFileIcon(type) {
  switch (type) {
    
    case 'image': return <HiOutlinePhotograph className="w-5 h-5" />;
    default: return <HiOutlineDocumentText className="w-5 h-5" />;
  }
}

function getFileColor(type) {
  switch (type) {
    case 'video': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';
    case 'pdf': return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400';
    case 'ppt': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400';
    case 'image': return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400';
    default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400';
  }
}

export default function UploadContent() {
  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const processFiles = (selectedFiles) => {
    const newFiles = Array.from(selectedFiles).map((file) => {
      const fileType = getFileType(file);
      const entry = {
        id: Date.now() + Math.random(),
        name: file.name,
        type: fileType,
        size: formatSize(file.size),
        progress: 0,
        status: 'uploading',
      };

      // Simulate upload progress
      let prog = 0;
      const interval = setInterval(() => {
        prog += Math.floor(Math.random() * 15 + 5);
        if (prog >= 100) {
          prog = 100;
          clearInterval(interval);
          setFiles((prev) => prev.map((f) => f.id === entry.id ? { ...f, progress: 100, status: 'uploaded' } : f));
        } else {
          setFiles((prev) => prev.map((f) => f.id === entry.id ? { ...f, progress: prog } : f));
        }
      }, 400);

      return entry;
    });

    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      processFiles(e.target.files);
      e.target.value = '';
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const removeFile = (id) => setFiles((prev) => prev.filter((f) => f.id !== id));

  return (
    <div className="max-w-4xl animate-fade-in">
      <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">Upload Content</h1>
      <p className="text-gray-500 dark:text-gray-400 mt-1 mb-8">Upload videos, PDFs, and other course materials.</p>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".mp4,.mov,.avi,.mkv,.webm,.pdf,.pptx,.ppt,.jpg,.jpeg,.png,.gif,.webp,.svg,.doc,.docx,.zip"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload Area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300
          ${dragOver
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 scale-[1.02]'
            : 'border-gray-300 dark:border-dark-600 hover:border-primary-400 hover:bg-gray-50 dark:hover:bg-dark-800/50'
          }`}
      >
        <div className="text-5xl mb-4">📤</div>
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
          {dragOver ? 'Drop files here!' : 'Drag & drop files here or click to browse'}
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Supports MP4, PDF, PPTX, Images & more</p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Uploaded Files</h2>
            <span className="text-sm text-gray-400 dark:text-gray-500">{files.length} file{files.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="space-y-3">
            {files.map((file) => (
              <div key={file.id} className="glass-card p-4 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${getFileColor(file.type)}`}>
                  {getFileIcon(file.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{file.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400">{file.size}</span>
                    {file.status === 'uploading' && (
                      <div className="flex-1 max-w-32 h-1.5 bg-gray-200 dark:bg-dark-700 rounded-full">
                        <div className="h-full gradient-bg rounded-full transition-all duration-300" style={{ width: `${file.progress}%` }} />
                      </div>
                    )}
                  </div>
                </div>
                {file.status === 'uploaded' ? (
                  <HiOutlineCheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                ) : (
                  <span className="text-xs font-bold text-primary-600 dark:text-primary-400">{file.progress}%</span>
                )}
                <button onClick={() => removeFile(file.id)} className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                  <HiOutlineTrash className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

