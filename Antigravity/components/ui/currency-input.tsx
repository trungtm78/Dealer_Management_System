
import * as React from "react"
import { Input } from "@/components/ui/input"

interface CurrencyInputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
    value: number
    onChange: (value: number) => void
    currency?: string
    locale?: string
}

export const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
    ({ value, onChange, currency, locale = "vi-VN", className, ...props }, ref) => {
        // Format the number to string with thousands separators
        const formatNumber = (num: number) => {
            // Create formatter options based on if currency is provided or we just want numbers
            // User asked for "format số hoặc số tiền".
            // We will default to standard decimal formatting.
            return new Intl.NumberFormat(locale).format(num);
        }

        const [displayValue, setDisplayValue] = React.useState(value ? formatNumber(value) : "")

        // Update display value when external value changes
        React.useEffect(() => {
            if (value !== undefined && value !== null) {
                // If the parsed display value is different from new value, update it.
                // This prevents cursor jumping issues to some extent if we were strictly controlled,
                // but here we are syncing.
                const currentNumeric = parseInt(displayValue.replace(/\./g, '').replace(/,/g, '') || '0');
                if (currentNumeric !== value) {
                    setDisplayValue(value === 0 ? "" : formatNumber(value));
                }
            }
        }, [value])

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            // Get raw value: remove non-numeric chars except possible decimal based on locale?
            // For VN, dot is thousand separator.
            // Let's assume integer for now as most prices in this app are integers.
            const rawInput = e.target.value.replace(/[^0-9]/g, "");

            if (rawInput === "") {
                setDisplayValue("");
                onChange(0);
                return;
            }

            const numericValue = parseInt(rawInput);
            if (!isNaN(numericValue)) {
                setDisplayValue(formatNumber(numericValue));
                onChange(numericValue);
            }
        }

        return (
            <Input
                ref={ref}
                type="text"
                inputMode="numeric"
                value={displayValue}
                onChange={handleChange}
                className={className}
                {...props}
            />
        )
    }
)
CurrencyInput.displayName = "CurrencyInput"
