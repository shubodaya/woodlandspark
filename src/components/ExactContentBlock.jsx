import { FileText } from "lucide-react";
import { getOldPageContent } from "../data/oldSiteContent.js";
import { SectionHeading } from "./Sections.jsx";

export function ExactContentBlock({ sourceUrl }) {
  const content = getOldPageContent(sourceUrl);
  if (!content) return null;

  return (
    <section className="section-band bg-white py-12">
      <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
        <SectionHeading
          eyebrow="Woodlands Information"
          title="Visitor Information"
          text="Helpful visitor details for families planning their day at Woodlands."
        />
        <div className="mt-6 rounded-lg border-2 border-sunshine bg-mist p-5 shadow-sm">
          <p className="inline-flex items-center gap-2 rounded-lg bg-woodpink px-3 py-2 text-sm font-black uppercase tracking-wide text-white">
            <FileText aria-hidden="true" size={16} />
            {content.title}
          </p>
          <div className="mt-5 max-h-[34rem] overflow-auto rounded-lg bg-white p-5 text-sm leading-7 text-slate-700">
            {content.lines.map((line, index) => {
              const looksLikeHeading = line.length < 80 && !/[.!?]$/.test(line);
              if (looksLikeHeading) {
                return (
                  <h3 key={`${line}-${index}`} className="mt-6 first:mt-0 font-display text-2xl font-black text-ink">
                    {line}
                  </h3>
                );
              }
              return (
                <p key={`${line}-${index}`} className="mt-3 whitespace-pre-line">
                  {line}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
