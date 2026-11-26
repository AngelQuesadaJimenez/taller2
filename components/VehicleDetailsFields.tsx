import { usePreferences } from "@/components/Preferences";

export function VehicleDetailsFields({ yearErrorId }: { yearErrorId?: string }) {
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
      <div className="vehicle-year-field">
        <label>{copy.year}
          <input name="year" aria-invalid={yearErrorId ? true : undefined} aria-describedby={yearErrorId}
            inputMode="numeric" pattern="[0-9]{4}" maxLength={4} placeholder={copy.yearExample} title={copy.yearHelp} />
        </label>
        {yearErrorId && <p role="alert" id={yearErrorId} className="form-error">{copy.invalidYear}</p>}
      </div>
    </>
  );
}
