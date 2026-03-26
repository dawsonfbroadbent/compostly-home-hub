import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const US_STATES = [
  { value: "AL", label: "Alabama" }, { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" }, { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" }, { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" }, { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" }, { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" }, { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" }, { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" }, { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" }, { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" }, { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" }, { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" }, { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" }, { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" }, { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" }, { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" }, { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" }, { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" }, { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" }, { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" }, { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" }, { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" }, { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" }, { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" }, { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" }, { value: "WY", label: "Wyoming" },
  { value: "DC", label: "District of Columbia" },
];

export interface AddressValue {
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
}

export function validateAddress(addr: AddressValue, required: boolean): string | null {
  if (required) {
    if (!addr.street_address.trim()) return "Street address is required.";
    if (!addr.city.trim()) return "City is required.";
    if (!addr.state) return "State is required.";
    if (!addr.zip_code.trim()) return "ZIP code is required.";
  }

  // Partial entry validation: if any field is filled, all required fields must be filled
  const anyFilled = addr.street_address.trim() || addr.city.trim() || addr.state || addr.zip_code.trim();
  if (anyFilled && !required) {
    if (!addr.street_address.trim()) return "Street address is required when providing an address.";
    if (!addr.city.trim()) return "City is required when providing an address.";
    if (!addr.state) return "State is required when providing an address.";
    if (!addr.zip_code.trim()) return "ZIP code is required when providing an address.";
  }

  if (addr.zip_code.trim() && !/^\d{5}(-\d{4})?$/.test(addr.zip_code.trim())) {
    return "ZIP code must be 5 digits (e.g. 84101) or ZIP+4 format (e.g. 84101-1234).";
  }

  if (addr.city.trim().length > 100) {
    return "City must be 100 characters or fewer.";
  }

  if (addr.street_address.trim().length > 255) {
    return "Street address must be 255 characters or fewer.";
  }

  return null;
}

export function addressToDisplayString(addr: AddressValue): string {
  const parts = [
    addr.street_address.trim(),
    addr.city.trim(),
    addr.state,
    addr.zip_code.trim(),
  ].filter(Boolean);
  return parts.join(", ");
}

interface AddressFieldsProps {
  value: AddressValue;
  onChange: (value: AddressValue) => void;
  required?: boolean;
  idPrefix?: string;
  disabled?: boolean;
}

const AddressFields = ({ value, onChange, required = false, idPrefix = "addr", disabled = false }: AddressFieldsProps) => {
  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor={`${idPrefix}-street`}>
          Street Address {required && <span className="text-destructive">*</span>}
        </Label>
        <Input
          id={`${idPrefix}-street`}
          required={required}
          disabled={disabled}
          maxLength={255}
          value={value.street_address}
          onChange={(e) => onChange({ ...value, street_address: e.target.value })}
          placeholder="123 Main St"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor={`${idPrefix}-city`}>
            City {required && <span className="text-destructive">*</span>}
          </Label>
          <Input
            id={`${idPrefix}-city`}
            required={required}
            disabled={disabled}
            maxLength={100}
            value={value.city}
            onChange={(e) => onChange({ ...value, city: e.target.value })}
            placeholder="Salt Lake City"
          />
        </div>
        <div>
          <Label htmlFor={`${idPrefix}-state`}>
            State {required && <span className="text-destructive">*</span>}
          </Label>
          <Select
            disabled={disabled}
            value={value.state}
            onValueChange={(val) => onChange({ ...value, state: val })}
          >
            <SelectTrigger id={`${idPrefix}-state`}>
              <SelectValue placeholder="State" />
            </SelectTrigger>
            <SelectContent>
              {US_STATES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor={`${idPrefix}-zip`}>
            ZIP Code {required && <span className="text-destructive">*</span>}
          </Label>
          <Input
            id={`${idPrefix}-zip`}
            required={required}
            disabled={disabled}
            maxLength={10}
            value={value.zip_code}
            onChange={(e) => onChange({ ...value, zip_code: e.target.value.replace(/[^\d-]/g, "") })}
            placeholder="84101"
            pattern="^\d{5}(-\d{4})?$"
          />
        </div>
      </div>
    </div>
  );
};

export default AddressFields;
