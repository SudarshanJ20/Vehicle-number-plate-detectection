import { useDropzone } from 'react-dropzone'
import { Upload, ImageIcon } from 'lucide-react'
import clsx from 'clsx'

export default function DropZone({ onFile, disabled }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.bmp'] },
    maxFiles: 1,
    disabled,
    onDrop: (accepted) => accepted[0] && onFile(accepted[0])
  })

  return (
    <div {...getRootProps()} className={clsx(
      'relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 select-none',
      isDragActive
        ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 scale-[1.01]'
        : 'border-gray-300 dark:border-gray-700 hover:border-brand-400 hover:bg-gray-50 dark:hover:bg-gray-900/40',
      disabled && 'opacity-50 cursor-not-allowed'
    )}>
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-3">
        <div className={clsx(
          'w-16 h-16 rounded-2xl flex items-center justify-center transition-colors duration-200',
          isDragActive ? 'bg-brand-100 dark:bg-brand-900/40' : 'bg-gray-100 dark:bg-gray-800'
        )}>
          {isDragActive ? <ImageIcon size={28} className="text-brand-600" /> : <Upload size={28} className="text-gray-400" />}
        </div>
        <div>
          <p className="font-semibold text-gray-700 dark:text-gray-300 text-sm">
            {isDragActive ? 'Drop image here' : 'Drag & drop a vehicle image'}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            or <span className="text-brand-600 font-medium">click to browse</span> — JPG, PNG, WebP supported
          </p>
        </div>
        <div className="flex gap-2 mt-1">
          {['Day', 'Night', 'Blurry', 'Angled'].map(tag => (
            <span key={tag} className="badge bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs px-2 py-0.5 rounded-full">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
