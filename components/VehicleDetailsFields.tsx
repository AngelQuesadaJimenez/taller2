import { usePreferences } from "@/components/Preferences";

export function VehicleDetailsFields({ yearValidation }: {
  yearValidation?: { "aria-invalid"?: boolean; "aria-describedby"?: string };
}) {
  const { t } = usePreferences();
  const copy = t.form;

  return (
    <>
      <label>{copy.make}
        <input name="make" placeholder={copy.makeExample} maxLength={80} />
      </label>
      <label>{copy.model}
        <input name="model" placeholder={copy.modelExample} maxLength={100} />
      </label>
      <label>{copy.year}
        <input name="year" {...yearValidation} inputMode="numeric" pattern="[0-9]{4}"
          maxLength={4} placeholder={copy.yearExample} title={copy.yearHelp} />
      </label>
    </>
  );
}
