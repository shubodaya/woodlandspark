import { mkdir, writeFile } from "node:fs/promises";
import { dirname, extname } from "node:path";

const outDir = "src/assets/images";
const manifestPath = "tools/asset-sources.json";

const assets = [
  ["logo-circle.jpg", "https://www.woodlandspark.com/wp-content/uploads/2024/09/WL-Circle-Logo.jpg"],
  ["logo/woodlands-logo-circle.jpg", "https://www.woodlandspark.com/wp-content/uploads/2024/09/WL-Circle-Logo.jpg"],
  ["logo/woodlands-footer-logo.png", "https://www.woodlandspark.com/wp-content/uploads/2016/04/Woodlands-Footer-logo.png.pagespeed.ce.Y-AIbo2n-f.png"],
  ["logo/wheelgate-footer-logo.png", "https://www.woodlandspark.com/wp-content/uploads/2016/04/wheelgate_footer_logo.png.pagespeed.ce.0X_KcJnOfe.png"],
  ["logo/twinlakes-footer-logo.png", "https://www.woodlandspark.com/wp-content/uploads/2016/04/twinlakes_footer_logo.png.pagespeed.ce.uJYe29ZCpb.png"],
  ["home-hero.jpg", "https://www.woodlandspark.com/wp-content/uploads/2025/02/Woodlands-Homepage-Featured-Image-1.jpg"],
  ["action-zone.jpg", "https://www.woodlandspark.com/wp-content/uploads/2023/04/Action-Track-One-Explore.jpg"],
  ["arctic-zone.jpg", "https://www.woodlandspark.com/wp-content/uploads/2023/04/Avalanche-Explore.jpg"],
  ["circus-zone.jpg", "https://www.woodlandspark.com/wp-content/uploads/2023/04/Master-Blaster-Explore.jpg"],
  ["cyclone-zone.jpg", "https://www.woodlandspark.com/wp-content/uploads/2023/04/Sidewinder-Explore.jpg"],
  ["falconry-centre.jpg", "https://www.woodlandspark.com/wp-content/uploads/2023/04/Daily-Falconry-Displays-Explore.jpg"],
  ["farm-rides.jpg", "https://www.woodlandspark.com/wp-content/uploads/2023/04/Tractor-Ride-Explore.jpg"],
  ["ninja-zone.jpg", "https://www.woodlandspark.com/wp-content/uploads/2023/04/Ninja-Towers-Explore.jpg"],
  ["sea-monster-zone.jpg", "https://www.woodlandspark.com/wp-content/uploads/2024/03/Tugboat-Pano-1024x430.jpg"],
  ["toddlers-zone.jpg", "https://www.woodlandspark.com/wp-content/uploads/2023/04/Toddler-Village-Play-Area-Explore.jpg"],
  ["zoo-farm.jpg", "https://www.woodlandspark.com/wp-content/uploads/2022/12/Meerkat.jpg"],
  ["big-farm-animals.jpg", "https://www.woodlandspark.com/wp-content/uploads/2024/09/Shire-Horse.jpg"],
  ["furry-friends.jpg", "https://www.woodlandspark.com/wp-content/uploads/2024/09/Asian-Small-clawed-Otter.jpg"],
  ["insects.jpg", "https://www.woodlandspark.com/wp-content/uploads/2015/02/LS-2010-4-alpaccas-one-looking-at-camera.jpg"],
  ["new-babies.jpg", "https://www.woodlandspark.com/wp-content/uploads/2016/11/Baby-goat.jpg"],
  ["nocturnal-house.jpg", "https://www.woodlandspark.com/wp-content/uploads/2024/05/Chinchilla-2.jpg"],
  ["reptile-house.jpg", "https://www.woodlandspark.com/wp-content/uploads/2023/06/Green-Iguana.jpg"],
  ["rabbit-guinea-pig-city.jpg", "https://www.woodlandspark.com/wp-content/uploads/2023/01/Rabbits-2.jpg"],
  ["animal-activities.jpg", "https://www.woodlandspark.com/wp-content/uploads/2023/04/Chick-petting-animal-activity-1.jpg"],
  ["zoo-rides.jpg", "https://www.woodlandspark.com/wp-content/uploads/2022/12/Zoofarm-Rides.jpg"],
  ["camping.jpg", "https://www.woodlandspark.com/wp-content/uploads/2023/02/Falcons-View.jpg"],
  ["camping-watercoasters.jpg", "https://www.woodlandspark.com/wp-content/uploads/2023/02/Theme-Park-Watercoasters.jpg"],
  ["park-map.jpg", "https://www.woodlandspark.com/wp-content/uploads/2025/02/2025-Woodlands-Park-Map-V2-1.jpg"],
  ["accessibility.jpg", "https://www.woodlandspark.com/wp-content/uploads/2023/07/Woodlands-Accessibility.jpg"],
  ["birthday.jpg", "https://www.woodlandspark.com/wp-content/uploads/2023/03/Birthdays-Title-Banner-copy.jpg"],
  ["annual-pass.jpg", "https://www.woodlandspark.com/wp-content/uploads/2024/01/2024-Annual-Pass-Webpage-Banner.jpg"],
  ["childminder-pass.jpg", "https://www.woodlandspark.com/wp-content/uploads/2023/01/Childminder-Annual-Pass-Title-Banner-copy.jpg"],
  ["dog-kennels.jpg", "https://www.woodlandspark.com/wp-content/uploads/2026/04/Untitled-design-62.jpg"],
  ["group-bookings.jpg", "https://www.woodlandspark.com/wp-content/uploads/2023/02/Group-Bookings-Title-Banner.jpg"],
  ["corporate.jpg", "https://www.woodlandspark.com/wp-content/uploads/2024/11/Corporate-Bookings-Title-Banner-copy.jpg"],
  ["recruitment.jpg", "https://www.woodlandspark.com/wp-content/uploads/2023/01/Recruitment-Banner.jpg"],
  ["gift-voucher.jpg", "https://www.woodlandspark.com/wp-content/uploads/2021/12/Gift-Voucher-Flip-Boxes-Day-Voucher-1.jpg"],
  ["food-cafe.jpg", "https://www.woodlandspark.com/wp-content/uploads/2015/02/cafe_460x300-300x236.jpg"],
  ["titan-event.jpg", "https://www.woodlandspark.com/wp-content/uploads/2026/03/Titan-event-page-banner.jpg"],
  ["titan-august.jpg", "https://www.woodlandspark.com/wp-content/uploads/2026/05/1.jpg"],
  ["annual-pass-offer.jpg", "https://www.woodlandspark.com/wp-content/uploads/2026/01/Untitled-design-27.jpg"],
  ["feb-offer.jpg", "https://www.woodlandspark.com/wp-content/uploads/2026/02/Untitled-design-48.jpg"],
  ["easter-sale.jpg", "https://www.woodlandspark.com/wp-content/uploads/2026/03/Easter-20-5.jpg"],
  ["easter-grotto.jpg", "https://www.woodlandspark.com/wp-content/uploads/2026/03/Easter-20-10.jpg"],
  ["bluey-event.jpg", "https://www.woodlandspark.com/wp-content/uploads/2026/03/Template-Social-Square-Bluey.psd.jpg"],
  ["hallooscream.jpg", "https://www.woodlandspark.com/wp-content/uploads/2025/10/Main-image.jpg"],
  ["christmas-grotto.jpg", "https://www.woodlandspark.com/wp-content/uploads/2025/09/WintergrottoBanner-1800-x-1080-px-2.jpg"],
  ["blog-spring.jpg", "https://www.woodlandspark.com/wp-content/uploads/2024/05/Blog-Spring-Animals-Featured-Image.jpg"],
  ["blog-35.jpg", "https://www.woodlandspark.com/wp-content/uploads/2024/05/35-years-of-Woodlands-Blog-Featured-Image.jpg"],
  ["blog-awards.jpg", "https://www.woodlandspark.com/wp-content/uploads/2019/11/IMG_4830-e1574166054678.jpg"],
];

async function download(name, url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0 local Woodlands redesign asset fetcher",
    },
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText} for ${url}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  await mkdir(dirname(`${outDir}/${name}`), { recursive: true });
  await writeFile(`${outDir}/${name}`, buffer);
  return { name, url, bytes: buffer.length, ext: extname(name) };
}

async function main() {
  await mkdir(outDir, { recursive: true });
  const manifest = [];
  for (const [name, url] of assets) {
    manifest.push(await download(name, url));
  }
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  console.log(`Downloaded ${manifest.length} assets.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
