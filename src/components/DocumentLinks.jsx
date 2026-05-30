import { Download } from "lucide-react";
import { documentAsset } from "../data/assets.js";
import { documentsForPage } from "../data/documents.js";

export function DocumentLinks({ path, sourceUrl, title = "Downloads" }) {
  const documents = [
    ...documentsForPage(path || ""),
    ...documentsForPage(sourceUrl || ""),
  ].filter((document, index, all) => all.findIndex((item) => item.localFile === document.localFile) === index);

  if (!documents.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 lg:px-6" aria-labelledby="download-links-title">
      <div className="rounded-lg border-2 border-sunshine bg-white p-5 shadow-lift">
        <h2 id="download-links-title" className="font-display text-3xl font-black text-ink">
          {title}
        </h2>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {documents.map((document) => {
            const href = documentAsset(document.localFile);
            if (!href) return null;
            return (
              <a
                key={document.localFile}
                className="focus-ring flex gap-3 rounded-lg border border-slate-200 bg-mist p-4 text-ink transition hover:-translate-y-0.5 hover:border-sky hover:bg-white"
                href={href}
                target="_blank"
                rel="noreferrer"
              >
                <Download aria-hidden="true" className="mt-1 shrink-0 text-berry" />
                <span>
                  <span className="block font-display text-xl font-black">{document.title}</span>
                  <span className="mt-1 block text-sm leading-6 text-slate-700">{document.description}</span>
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
