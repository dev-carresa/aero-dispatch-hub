
import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileImage } from "lucide-react"

interface FileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  showPreview?: boolean
  className?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  previewUrl?: string
}

const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  ({ className, label, showPreview = true, previewUrl, onChange, ...props }, ref) => {
    const [previewImage, setPreviewImage] = React.useState<string | null>(previewUrl || null)
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0]
        const reader = new FileReader()
        reader.onload = (event) => {
          if (event.target?.result) {
            setPreviewImage(event.target.result as string)
          }
        }
        reader.readAsDataURL(file)
      }
      
      if (onChange) {
        onChange(e)
      }
    }
    
    return (
      <div className={cn("space-y-2", className)}>
        {label && <Label>{label}</Label>}
        <div className="grid gap-4 sm:grid-cols-[1fr_2fr]">
          {showPreview && (
            <div className="relative aspect-square w-full max-w-[150px] overflow-hidden rounded-md border border-dashed border-input bg-background flex items-center justify-center">
              {previewImage ? (
                <img 
                  src={previewImage} 
                  alt="Preview" 
                  className="h-full w-full object-cover" 
                />
              ) : (
                <FileImage className="h-10 w-10 text-muted-foreground" />
              )}
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
              Upload a profile picture. JPG, PNG or GIF.
            </p>
          </div>
        </div>
      </div>
    )
  }
)
FileInput.displayName = "FileInput"

export { FileInput }
