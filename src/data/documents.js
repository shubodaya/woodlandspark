export const documentDownloads = [
  {
    title: "Woodlands Family Theme Park Access Statement 2024",
    description: "Woodlands accessibility access statement PDF.",
    sourceUrl: "https://www.woodlandspark.com/wp-content/uploads/2024/12/Woodlands-Family-Theme-Park-Access-Statement-2024.pdf",
    localFile: "accessibility/woodlands-family-theme-park-access-statement-2024.pdf",
    pagePaths: ["/visiting/accessibility", "/visiting/height-restrictions"],
    pageSourceUrls: [
      "https://www.woodlandspark.com/your-visit/accessibility/",
      "https://www.woodlandspark.com/rides-attractions/height-restrictions/",
    ],
  },
  {
    title: "Childminder Annual Membership Form 2026",
    description: "Childminder annual pass application form PDF.",
    sourceUrl: "https://www.woodlandspark.com/wp-content/uploads/2026/01/Childminder-Annual-Membership-Form-2026.pdf",
    localFile: "forms/childminder-annual-membership-form-2026.pdf",
    pagePaths: ["/visiting/childminders-annual-pass"],
    pageSourceUrls: ["https://www.woodlandspark.com/your-visit/information/childminders-annual-pass/"],
  },
  {
    title: "Annual Membership Form 2026",
    description: "Annual membership application form PDF.",
    sourceUrl: "https://www.woodlandspark.com/wp-content/uploads/2026/01/Annual-Membership-Form-2026.pdf",
    localFile: "forms/annual-membership-form-2026.pdf",
    pagePaths: ["/visiting/annual-pass", "/visiting/faqs"],
    pageSourceUrls: [
      "https://www.woodlandspark.com/your-visit/information/annual-pass/",
      "https://www.woodlandspark.com/your-visit/faqs/",
    ],
  },
  {
    title: "Animal Keeper Job Description",
    description: "Recruitment job description DOCX.",
    sourceUrl: "https://www.woodlandspark.com/wp-content/uploads/2026/02/Animal-Keeper-Job-Description.docx",
    localFile: "recruitment/animal-keeper-job-description.docx",
    pagePaths: ["/visiting/recruitment"],
    pageSourceUrls: ["https://www.woodlandspark.com/recruitment/"],
  },
  {
    title: "Birthday Party Invitations",
    description: "Printable birthday party invitations PDF.",
    sourceUrl: "https://woodlandspark.com/wp-content/uploads/2015/02/Invite-2015-pdf.pdf",
    localFile: "birthday/invite-2015-pdf.pdf",
    pagePaths: ["/visiting/birthday-parties"],
    pageSourceUrls: ["https://www.woodlandspark.com/woodlands-birthday-parties/"],
  },
  {
    title: "Woodlands Safety Code",
    description: "Safety code PDF linked from the risk assessment page.",
    sourceUrl: "http://woodlandspark.com/wp-content/uploads/2015/02/Woodlands-Safety-Code-2016-updated-June-2016-1.pdf",
    localFile: "safety/woodlands-safety-code-2016-updated-june-2016-1.pdf",
    pagePaths: ["/groups/risk-assessments", "/visiting/height-restrictions"],
    pageSourceUrls: ["https://www.woodlandspark.com/groups/risk-assessments/"],
  },
  {
    title: "Full 2026 Calendar",
    description: "Full Woodlands 2026 opening calendar image.",
    sourceUrl: "https://www.woodlandspark.com/wp-content/uploads/2026/03/2026-Calendar-3.jpg",
    localFile: "opening-times/2026-calendar.jpg",
    pagePaths: ["/visiting/opening-times"],
    pageSourceUrls: ["https://www.woodlandspark.com/your-visit/information/opening-times/"],
  },
  {
    title: "2025 Woodlands Park Map",
    description: "Printable Woodlands park map image.",
    sourceUrl: "https://www.woodlandspark.com/wp-content/uploads/2025/02/2025-Woodlands-Park-Map-V2-1.jpg",
    localFile: "park-map/2025-woodlands-park-map-v2-1.jpg",
    pagePaths: ["/visiting/park-map"],
    pageSourceUrls: ["https://www.woodlandspark.com/your-visit/information/park-map/"],
  },
];

export function documentsForPage(pathOrSourceUrl) {
  return documentDownloads.filter((document) =>
    document.pagePaths.includes(pathOrSourceUrl) || document.pageSourceUrls.includes(pathOrSourceUrl),
  );
}
