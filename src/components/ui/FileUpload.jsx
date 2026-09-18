import { useRef, useState } from 'react'
import { UploadCloud, FileText, CheckCircle2 } from 'lucide-react'

/**
 * Zona drag & drop upload file.
 * onFilesSelected(fileList) dipanggil baik pas drop maupun pas pilih manual.
 * Logic upload ke API dilakuin di halaman pemanggil, komponen ini cuma UI pemilihan file.
 *
 * Contoh:
 * <FileDropzone
 *   label="Tarik & letakkan foto bukti transfer di sini"
 *   hint="Mendukung PNG, JPG, atau PDF (Maksimal 5MB)"
 *   accept="image/png,image/jpeg,application/pdf"
 *   onFilesSelected={(files) => setSelectedFile(files[0])}
 * />
 */
export function FileDropzone({ label, hint, accept, onFilesSelected, className = '' }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const handleFiles = (fileList) => {
    if (fileList?.length) onFilesSelected(Array.from(fileList))
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files) }}
      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all group
        ${dragging ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-300 hover:border-indigo-500 bg-slate-50/50 hover:bg-indigo-50/30'} ${className}`}
    >
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={(e) => handleFiles(e.target.files)} />
      <div className="w-12 h-12 rounded-full bg-indigo-50 group-hover:bg-indigo-100 text-indigo-600 mx-auto flex items-center justify-center mb-3 transition-colors">
        <UploadCloud size={24} />
      </div>
      <p className="text-xs font-bold text-slate-700">{label}</p>
      {hint && <p className="text-[11px] text-slate-400 mt-1">{hint}</p>}
      <button type="button" className="mt-3 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 shadow-xs hover:bg-slate-50">
        Pilih Dari Perangkat
      </button>
    </div>
  )
}

/**
 * Satu baris file dalam daftar lampiran.
 * status: 'uploading' (pakai progress 0-100) | 'done'
 */
export function FileListItem({ name, sizeLabel, status = 'done', progress = 0, onView }) {
  if (status === 'uploading') {
    return (
      <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <FileText size={18} className="text-indigo-600 shrink-0" />
            <span className="font-semibold text-slate-800 truncate">{name}</span>
          </div>
          <span className="font-mono text-slate-500 text-[11px]">{progress}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
          <div className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>
    )
  }

  return (
    <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/50 flex items-center justify-between">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-7 h-7 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
          <CheckCircle2 size={16} />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-slate-800 truncate">{name}</p>
          {sizeLabel && <p className="text-[10px] text-slate-400">{sizeLabel}</p>}
        </div>
      </div>
      {onView && (
        <button onClick={onView} className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold px-2 py-1 hover:bg-emerald-100/50 rounded">
          Perbesar
        </button>
      )}
    </div>
  )
}