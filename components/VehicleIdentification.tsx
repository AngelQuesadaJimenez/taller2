import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { usePreferences } from "@/components/Preferences";
import { VehicleDetailsFields } from "@/components/VehicleDetailsFields";
import { VehiclePlateField } from "@/components/VehiclePlateField";
import { AppIcon } from "@/components/ui/AppIcon";

const modes = ["plate", "details"] as const;

export function VehicleIdentification({ yearValidation }: {
  yearValidation?: { "aria-invalid"?: boolean; "aria-describedby"?: string };
}) {
  const { t } = usePreferences();
  const copy = t.vehicleIdentification;
  const group = useId();
  const [mode, setMode] = useState<typeof modes[number]>();

  return (
    <fieldset className="vehicle-identification">
      <legend>{copy.question}</legend>
      <div className="vehicle-modes">
        {modes.map((option) => (
          <label key={option} className="vehicle-mode">
            <input type="radio" name={group} value={option} checked={mode === option}
              aria-controls={group + "-" + option} onChange={() => setMode(option)} />
            <span>{copy[option]}</span>
            <AppIcon icon={ChevronDown} size="small" />
          </label>
        ))}
      </div>
      <fieldset id={group + "-plate"} className="vehicle-mode-fields" hidden={mode !== "plate"} disabled={mode !== "plate"}>
        <div className="fields"><VehiclePlateField /></div>
      </fieldset>
      <fieldset id={group + "-details"} className="vehicle-mode-fields" hidden={mode !== "details"} disabled={mode !== "details"}>
        <div className="fields vehicle-details-fields"><VehicleDetailsFields yearValidation={yearValidation} /></div>
      </fieldset>
    </fieldset>
  );
}
