import fs from 'node:fs';
import path from 'node:path';
import { Resvg } from '@resvg/resvg-js';

// Exact SVG recreation of the user's uploaded FlixDairy logo
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <defs>
    <!-- Embedded clean Bebas/Impact style font fallbacks -->
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&amp;display=swap');
      .brand-text {
        font-family: 'Bebas Neue', Impact, 'Arial Black', 'Helvetica Neue', sans-serif;
        font-size: 215px;
        font-weight: 900;
        letter-spacing: 4px;
        fill: #4D8BC9;
        text-anchor: middle;
      }
    </style>
  </defs>

  <!-- Deep Black Background -->
  <rect width="1000" height="1000" fill="#000000" />

  <!-- Centered Logo Group -->
  <g id="logo-mark">
    <!-- FLIXDAIRY in bold blue typography -->
    <text x="500" y="540" class="brand-text">FLIXDAIRY</text>

    <!-- Curved smile arrow swoosh in vibrant red -->
    <!-- Starts under L/I, swoops down under X/D, swoops up under A/I/R with arrowhead -->
    <path 
      d="M 260 615
         C 320 675, 410 725, 520 725
         C 610 725, 680 690, 715 650
         C 725 638, 715 630, 705 640
         C 665 675, 595 700, 510 700
         C 410 700, 325 655, 275 605
         C 268 598, 255 608, 260 615 Z"
      fill="#E52E2D"
    />
    <!-- Arrowhead at right of the smile -->
    <path 
      d="M 698 642
         C 715 628, 735 615, 742 610
         C 745 608, 746 612, 744 618
         C 738 638, 722 668, 704 698
         C 700 703, 694 698, 696 692
         C 700 675, 703 658, 698 642 Z"
      fill="#E52E2D"
    />
  </g>
</svg>`;

// Safe-zone maskable version with 15% inner padding for Android
const maskableSvgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&amp;display=swap');
      .brand-text {
        font-family: 'Bebas Neue', Impact, 'Arial Black', sans-serif;
        font-size: 175px;
        font-weight: 900;
        letter-spacing: 3px;
        fill: #4D8BC9;
        text-anchor: middle;
      }
    </style>
  </defs>
  <rect width="1000" height="1000" fill="#000000" />
  <g transform="translate(50, 40) scale(0.9)">
    <text x="500" y="540" class="brand-text">FLIXDAIRY</text>
    <path 
      d="M 260 615
         C 320 675, 410 725, 520 725
         C 610 725, 680 690, 715 650
         C 725 638, 715 630, 705 640
         C 665 675, 595 700, 510 700
         C 410 700, 325 655, 275 605
         C 268 598, 255 608, 260 615 Z"
      fill="#E52E2D"
    />
    <path 
      d="M 698 642
         C 715 628, 735 615, 742 610
         C 745 608, 746 612, 744 618
         C 738 638, 722 668, 704 698
         C 700 703, 694 698, 696 692
         C 700 675, 703 658, 698 642 Z"
      fill="#E52E2D"
    />
  </g>
</svg>`;

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Write the vector SVG files
fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent);
fs.writeFileSync(path.join(publicDir, 'logo.svg'), svgContent);
fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgContent);

// Helper to render PNG at target width and height using resvg
function renderPng(svg, width, height) {
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: width,
    },
    background: '#000000',
  });
  const pngData = resvg.render();
  return pngData.asPng();
}

// 2. Generate required PWA & browser PNGs
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), renderPng(svgContent, 192, 192));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), renderPng(svgContent, 512, 512));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), renderPng(maskableSvgContent, 512, 512));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), renderPng(svgContent, 180, 180));
fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), renderPng(svgContent, 32, 32));

console.log('Brand logo, icon.svg, favicon, and PWA icons generated successfully from uploaded reference!');
