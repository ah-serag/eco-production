import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params: { locale } }: any) {
  const t = await getTranslations({ locale, namespace: "about_page" });
  return { title: t("title") };
}

export default async function AboutPage({ params: { locale } }: { params: { locale: string } }) {
  const t    = await getTranslations({ locale, namespace: "about_page" });
  const isAr = locale === "ar";

  return (
    <main dir={isAr ? "rtl" : "ltr"} className="max-w-2xl mx-auto px-5 py-14 space-y-8">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{t("title")}</h1>
      {(["s1", "s2", "s3"] as const).map((key) => (
        <section key={key} className="space-y-2">
          <h2 className="text-[13px] font-semibold uppercase tracking-widest text-slate-400">
            {t(`${key}_title`)}
          </h2>
          <p className="text-[13px] text-slate-600 leading-relaxed">{t(`${key}_body`)}</p>
        </section>
      ))}
    </main>
  );
}
