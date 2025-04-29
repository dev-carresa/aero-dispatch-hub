
import * as React from "react"
import { Controller, ControllerProps, FieldPath, FieldValues } from "react-hook-form"
import PhoneInputLib from 'react-phone-number-input'
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import './phone-input.css'
import type { E164Number } from "libphonenumber-js"

interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  label?: string
  defaultCountry?: string
  className?: string
  error?: boolean
  value?: string | E164Number
  onChange: (value?: E164Number) => void
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, label, defaultCountry = "US", error, ...props }, ref) => {
    return (
      <div className={cn("space-y-2", className)}>
        {label && <Label className={cn(error && "text-destructive")}>{label}</Label>}
        <div className={cn("phone-input-container", error && "phone-input-error")}>
          <PhoneInputLib
            ref={ref as any}
            defaultCountry={defaultCountry as any}
            international
            countryCallingCodeEditable={false}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background",
              "file:border-0 file:bg-transparent file:text-sm file:font-medium",
              "placeholder:text-muted-foreground focus-visible:outline-none",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-destructive focus-visible:ring-destructive",
              className
            )}
            {...props}
          />
        </div>
      </div>
    )
  }
)
PhoneInput.displayName = "PhoneInput"

type FormPhoneInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  control: ControllerProps<TFieldValues, TName>["control"]
  name: ControllerProps<TFieldValues, TName>["name"]
  label?: string
  defaultCountry?: string
  className?: string
}

const FormPhoneInput = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  defaultCountry = "US",
  className,
  ...props
}: FormPhoneInputProps<TFieldValues, TName> & Omit<PhoneInputProps, "control" | "name" | "value" | "onChange">) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <PhoneInput
          label={label}
          defaultCountry={defaultCountry}
          value={field.value as string}
          onChange={field.onChange}
          error={!!fieldState.error}
          className={className}
          {...props}
        />
      )}
    />
  )
}

export { PhoneInput, FormPhoneInput }
