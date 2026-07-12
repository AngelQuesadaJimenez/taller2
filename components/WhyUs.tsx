import { whyChooseUs } from "@/data/site";
import { Icon } from "@/components/ui/Icon";

export function WhyUs() {
  return (
    <section id="por-que" className="section bg-white">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Por qué elegirnos</span>
          <h2 className="h2">Razones para confiar tu equipo en nuestras manos</h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {whyChooseUs.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-brand-100 p-6 transition-colors hover:border-spark-300 hover:bg-spark-50/40"
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-spark-100 text-spark-500">
                <Icon name={item.icon as never} className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-heading text-lg font-semibold text-brand-800">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-brand-600">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
