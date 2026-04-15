import { useDropzone } from 'react-dropzone'
import { Upload, ImageIcon } from 'lucide-react'
export default function DropZone({ onFile, disabled }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': ['.jpg','.jpeg','.png','.webp'] },
    maxFiles: 1, disabled,
    onDrop: (accepted) => accepted[0] && onFile(accepted[0])
  })
  return (
    <div {...getRootProps()} className={'border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ' +
      (isDragActive ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/30' : 'border-gray-300 dark:border-gray-700 hover:border-teal-400') +
      (disabled ? ' opacity-50 pointer-events-none' : '')}>
      <input {...getInputProps()}/>
      <div className="flex flex-col items-center gap-4">
        <div className={'w-16 h-16 rounded-2xl flex items-center justify-center ' + (isDragActive ? 'bg-teal-100' : 'bg-gray-100 dark:bg-gray-800')}>
          {isDragActive ? <ImageIcon size={28} className="text-teal-600 animate-bounce"/> : <Upload size={28} className="text-gray-400"/>}
        </div>
        <div>
          <p className="font-semibold text-gray-700 dark:text-gray-200">{isDragActive ? 'Drop it here!' : 'Drop a vehicle image'}</p>
          <p className="text-sm text-gray-400 mt-1">or <span className="text-teal-600 font-semibold underline">click to browse</span></p>
          <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP</p>
        </div>
      </div>
    </div>
  )
}