
export default async function NewsPage() {
  return (
    <div className="flex flex-col">
      <section className="bg-primary-800 py-24 text-center text-white">
        <p className="text-accent-400 text-sm font-semibold tracking-widest uppercase mb-3">News</p>
        <h1 className="heading-1">新着情報 / Notícias</h1>
      </section>
      <section className="py-20 container-custom text-center text-neutral-500">
        <p className="text-lg">Em breve / 準備中</p>
      </section>
    </div>
  );
}
