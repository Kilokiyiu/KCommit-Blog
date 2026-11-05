import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public');

const jobs = [
  { src: 'img/wallpaper/static/img_1.png', out: 'img/wallpaper/static/img_1.webp', w: 1920, q: 72 },
  { src: 'img/wallpaper/static-mobile/0001/modile.png', out: 'img/wallpaper/static-mobile/0001/modile.webp', w: 1080, q: 72 },
  { src: 'img/avatar.png', out: 'img/avatar.webp', w: 256, q: 80 },
  { src: 'img/avatar.png', out: 'img/avatar-64.webp', w: 64, q: 82 },
  { src: 'img/bento/featured.png', out: 'img/bento/featured.webp', w: 1200, q: 75 },
  { src: 'img/bento/my-favorite-wallpaper.png', out: 'img/bento/my-favorite-wallpaper.webp', w: 1400, q: 72 },
  { src: 'img/bento/wall-spring.jpg', out: 'img/bento/wall-spring.webp', w: 1200, q: 75 },
  { src: 'img/bento/wall-summer.jpg', out: 'img/bento/wall-summer.webp', w: 1200, q: 75 },
  { src: 'img/bento/wall-autumn.jpg', out: 'img/bento/wall-autumn.webp', w: 1200, q: 75 },
  { src: 'img/bento/wall-winter.jpg', out: 'img/bento/wall-winter.webp', w: 1200, q: 75 },
  { src: 'img/covers/hello-site.png', out: 'img/covers/hello-site.webp', w: 1600, q: 75 },
  { src: 'img/covers/default.png', out: 'img/covers/default.webp', w: 1200, q: 75 },
  { src: 'img/covers/kcommit-blog.png', out: 'img/covers/kcommit-blog.webp', w: 1200, q: 75 },
  { src: 'img/projects/listenease.png', out: 'img/projects/listenease.webp', w: 1200, q: 75 },
  { src: 'img/projects/personal-blog.png', out: 'img/projects/personal-blog.webp', w: 1200, q: 75 },
];

for (const job of jobs) {
  const input = path.join(root, job.src);
  const output = path.join(root, job.out);
  if (!fs.existsSync(input)) {
    console.log('SKIP missing', job.src);
    continue;
  }
  await sharp(input)
    .resize({ width: job.w, withoutEnlargement: true })
    .webp({ quality: job.q })
    .toFile(output);
  const a = fs.statSync(input).size;
  const b = fs.statSync(output).size;
  console.log(`${job.out}: ${Math.round(a / 1024)}KB -> ${Math.round(b / 1024)}KB`);
}
