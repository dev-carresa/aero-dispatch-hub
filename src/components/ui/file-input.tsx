
import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileImage, File as FileIcon, X } from "lucide-react"
import { Button } from "./button"

interface FileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  showPreview?: boolean
  className?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  previewUrl?: string
}

const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  ({ className, label, showPreview = true, previewUrl, onChange, ...props }, ref) => {
    const [files, setFiles] = React.useState<{file: File, preview: string}[]>([])
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const newFiles = Array.from(e.target.files).map(file => {
          return {
            file,
            preview: URL.createObjectURL(file)
          }
        })
        
        setFiles(prev => [...prev, ...newFiles])
      }
      
      if (onChange) {
        onChange(e)
      }
    }
    
    const removeFile = (indexToRemove: number) => {
      setFiles(prevFiles => {
        // Revoke the object URL to avoid memory leaks
        if (prevFiles[indexToRemove]?.preview) {
          URL.revokeObjectURL(prevFiles[indexToRemove].preview)
        }
        return prevFiles.filter((_, index) => index !== indexToRemove)
      })
    }
    
    // Clean up object URLs on unmount
    React.useEffect(() => {
      return () => {
        files.forEach(file => {
          URL.revokeObjectURL(file.preview)
        })
      }
    }, [])
    
    return (
      <div className={cn("space-y-2", className)}>
        {label && <Label>{label}</Label>}
        <div className="space-y-4">
          {showPreview && files.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {files.map((file, index) => (
                <div key={index} className="relative aspect-square w-full max-w-[150px] overflow-hidden rounded-md border border-input bg-background flex items-center justify-center group">
                  {file.file.type.startsWith('image/') ? (
                    <img 
                      src={file.preview} 
                      alt={file.file.name} 
                      className="h-full w-full object-cover" 
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-2 text-center">
                      <FileIcon className="h-8 w-8 text-muted-foreground" />
                      <span className="text-xs truncate max-w-full mt-1">{file.file.name}</span>
                    </div>
                  )}
                  <Button 
                    type="button"
                    variant="destructive" 
                    size="icon" 
                    className="h-6 w-6 absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          <div className="flex flex-col justify-center gap-2">
            <Input
              ref={ref}
              type="file"
              className="cursor-pointer"
              onChange={handleChange}
              {...props}
            />
            <p className="text-xs text-muted-foreground">
              {props.accept ? `Supported formats: ${props.accept.replace(/\./g, '').toUpperCase()}` : 'Upload files'}
            </p>
          </div>
        </div>
      </div>
    )
  }
)
FileInput.displayName = "FileInput"

export { FileInput }
