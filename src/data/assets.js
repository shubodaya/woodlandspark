const modules = import.meta.glob("../assets/images/**/*.{jpg,jpeg,jfif,png,webp,avif,gif,bmp,svg}", {
  eager: true,
  query: "?url",
  import: "default",
});

const documentModules = import.meta.glob("../assets/documents/**/*.{pdf,doc,docx,xls,xlsx,csv,zip,jpg,jpeg,png}", {
  eager: true,
  query: "?url",
  import: "default",
});

export function image(name) {
  const key = `../assets/images/${name}`;
  return modules[key] || "";
}

export function mediaSource(name) {
  if (!name) return "";
  if (String(name).startsWith("/") || String(name).startsWith("data:")) return name;
  return image(name) || name;
}

export function documentAsset(name) {
  const key = `../assets/documents/${name}`;
  return documentModules[key] || "";
}
