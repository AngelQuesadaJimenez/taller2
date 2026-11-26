import { useId } from "react";
import { usePreferences } from "@/components/Preferences";

export function VehiclePlateField() {
  const { t } = usePreferences();
  const id = useId();

  return (
    <div className="vehicle-plate field-wide">
      <label>
        {t.form.plate}
        <input name="plate" autoComplete="off" autoCapitalize="characters" spellCheck={false} maxLength={24} aria-describedby={id} />
      </label>
      <p className="vehicle-plate-help" id={id}>{t.form.plateHelp}</p>
    </div>
  );
}
