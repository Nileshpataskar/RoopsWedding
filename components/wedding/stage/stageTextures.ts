import * as THREE from "three";

/**
 * Textures painted on a canvas at runtime, so the stage ships no image files.
 * All of them are small and generated once per stage mount.
 */

const GOLD = "#c99a45";
const GOLD_LIGHT = "#f0d08a";

function paint(width: number, height: number, draw: (g: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  draw(canvas.getContext("2d")!);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

/** A small seeded random so the fabric looks the same on every visit. */
function random(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

function buta(g: CanvasRenderingContext2D, x: number, y: number, size: number) {
  g.save();
  g.translate(x, y);
  g.scale(size / 20, size / 20);
  g.beginPath();
  g.moveTo(0, 18);
  g.bezierCurveTo(-11, 12, -10, -6, 0, -8);
  g.bezierCurveTo(9, -9, 11, 2, 3, 5);
  g.bezierCurveTo(-1, 6, -2, 1, 1, 0);
  g.moveTo(0, 18);
  g.bezierCurveTo(7, 12, 10, 8, 9, 2);
  g.stroke();
  g.beginPath();
  g.arc(0, 11, 1.6, 0, Math.PI * 2);
  g.fill();
  g.restore();
}

/**
 * Velvet curtain: u runs from the outer edge (0) to the leading edge (1),
 * where a broad zari border is woven; a hem band runs along the bottom.
 */
export function velvetTexture() {
  return paint(512, 1536, (g) => {
    const rand = random(7);
    const base = g.createLinearGradient(0, 0, 0, 1536);
    base.addColorStop(0, "#4c2066");
    base.addColorStop(0.6, "#411b5a");
    base.addColorStop(1, "#33144a");
    g.fillStyle = base;
    g.fillRect(0, 0, 512, 1536);

    // pile grain
    for (let i = 0; i < 1400; i++) {
      g.fillStyle = `rgba(${rand() > 0.5 ? "255,215,250" : "20,0,25"},${rand() * 0.05})`;
      g.fillRect(rand() * 512, 0, 1 + rand() * 2, 1536);
    }

    // scattered gold buta
    g.strokeStyle = "rgba(214,173,92,0.42)";
    g.fillStyle = "rgba(214,173,92,0.5)";
    g.lineWidth = 1.6;
    for (let row = 0; row < 13; row++) {
      for (let col = 0; col < 5; col++) {
        const x = 30 + col * 92 + (row % 2) * 46;
        if (x > 420) continue;
        buta(g, x, 60 + row * 112, 26);
      }
    }

    // leading-edge zari border
    g.fillStyle = "#7a5222";
    g.fillRect(430, 0, 82, 1536);
    const zari = g.createLinearGradient(430, 0, 512, 0);
    zari.addColorStop(0, GOLD);
    zari.addColorStop(0.5, GOLD_LIGHT);
    zari.addColorStop(1, GOLD);
    g.fillStyle = zari;
    g.fillRect(440, 0, 62, 1536);
    g.fillStyle = "#411b5a";
    for (let y = 0; y < 1536; y += 36) {
      g.beginPath();
      g.moveTo(471, y);
      g.lineTo(484, y + 18);
      g.lineTo(471, y + 36);
      g.lineTo(458, y + 18);
      g.closePath();
      g.fill();
    }
    g.fillStyle = GOLD_LIGHT;
    for (let y = 18; y < 1536; y += 36) {
      g.beginPath();
      g.arc(471, y, 3.4, 0, Math.PI * 2);
      g.fill();
    }
    g.strokeStyle = "#5e3a12";
    g.lineWidth = 2;
    for (const x of [436, 506]) {
      g.beginPath();
      g.moveTo(x, 0);
      g.lineTo(x, 1536);
      g.stroke();
    }

    // hem band with scallops
    const hem = g.createLinearGradient(0, 1440, 0, 1536);
    hem.addColorStop(0, GOLD);
    hem.addColorStop(0.5, GOLD_LIGHT);
    hem.addColorStop(1, "#8a5d24");
    g.fillStyle = hem;
    g.fillRect(0, 1462, 512, 74);
    g.fillStyle = "#411b5a";
    for (let x = 0; x < 512; x += 32) {
      g.beginPath();
      g.arc(x + 16, 1462, 12, 0, Math.PI);
      g.fill();
    }
    g.fillStyle = "#6a2a3a";
    for (let x = 8; x < 512; x += 32) {
      g.beginPath();
      g.arc(x + 8, 1505, 5, 0, Math.PI * 2);
      g.fill();
    }
  });
}

/** Twisted gold rope; repeat vertically along the rope's length. */
export function ropeTexture() {
  const texture = paint(64, 128, (g) => {
    g.fillStyle = "#a8772c";
    g.fillRect(0, 0, 64, 128);
    for (let i = -2; i < 6; i++) {
      const strand = g.createLinearGradient(0, i * 32, 64, i * 32 + 40);
      strand.addColorStop(0, "#8a5d20");
      strand.addColorStop(0.5, GOLD_LIGHT);
      strand.addColorStop(1, "#8a5d20");
      g.fillStyle = strand;
      g.beginPath();
      g.moveTo(0, i * 32);
      g.lineTo(64, i * 32 + 40);
      g.lineTo(64, i * 32 + 58);
      g.lineTo(0, i * 32 + 18);
      g.closePath();
      g.fill();
    }
  });
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/** Fine vertical threads for the tassel skirt. */
export function fringeTexture() {
  const texture = paint(128, 32, (g) => {
    g.fillStyle = "#9b6a26";
    g.fillRect(0, 0, 128, 32);
    for (let x = 0; x < 128; x += 4) {
      g.fillStyle = x % 8 ? GOLD_LIGHT : GOLD;
      g.fillRect(x, 0, 2, 32);
    }
  });
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

/** Polished stage floor with a gold inlay and a faint rangoli. */
export function floorTexture() {
  return paint(1024, 512, (g) => {
    const base = g.createLinearGradient(0, 0, 0, 512);
    base.addColorStop(0, "#2a0f2e");
    base.addColorStop(1, "#4a2236");
    g.fillStyle = base;
    g.fillRect(0, 0, 1024, 512);

    const pool = g.createRadialGradient(512, 120, 10, 512, 120, 520);
    pool.addColorStop(0, "rgba(255,196,120,0.35)");
    pool.addColorStop(1, "rgba(255,196,120,0)");
    g.fillStyle = pool;
    g.fillRect(0, 0, 1024, 512);

    g.strokeStyle = "rgba(214,173,92,0.75)";
    g.lineWidth = 4;
    g.beginPath();
    g.moveTo(0, 22);
    g.lineTo(1024, 22);
    g.stroke();
    g.lineWidth = 1.5;
    g.setLineDash([6, 8]);
    g.beginPath();
    g.moveTo(0, 34);
    g.lineTo(1024, 34);
    g.stroke();
    g.setLineDash([]);

    g.strokeStyle = "rgba(214,173,92,0.22)";
    g.lineWidth = 2;
    for (let r = 50; r <= 170; r += 40) {
      g.beginPath();
      g.ellipse(512, 210, r * 1.6, r * 0.55, 0, 0, Math.PI * 2);
      g.stroke();
    }
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      g.beginPath();
      g.ellipse(512 + Math.cos(a) * 190, 210 + Math.sin(a) * 66, 26, 10, a, 0, Math.PI * 2);
      g.stroke();
    }
  });
}

/** Soft round sprite for glowing motes. */
export function glowTexture() {
  return paint(64, 64, (g) => {
    const glow = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    glow.addColorStop(0, "rgba(255,240,200,1)");
    glow.addColorStop(0.35, "rgba(255,205,120,0.55)");
    glow.addColorStop(1, "rgba(255,190,90,0)");
    g.fillStyle = glow;
    g.fillRect(0, 0, 64, 64);
  });
}

/** Blob shadow for grounding the characters without shadow maps. */
export function shadowTexture() {
  return paint(128, 128, (g) => {
    const shade = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    shade.addColorStop(0, "rgba(10,0,14,0.7)");
    shade.addColorStop(0.6, "rgba(10,0,14,0.3)");
    shade.addColorStop(1, "rgba(10,0,14,0)");
    g.fillStyle = shade;
    g.fillRect(0, 0, 128, 128);
  });
}

/** A glossy pink heart with a gold rim, for the couple's little hearts. */
export function heartTexture() {
  return paint(128, 128, (g) => {
    const heart = () => {
      g.beginPath();
      g.moveTo(64, 112);
      g.bezierCurveTo(18, 82, 6, 52, 18, 32);
      g.bezierCurveTo(30, 12, 56, 14, 64, 36);
      g.bezierCurveTo(72, 14, 98, 12, 110, 32);
      g.bezierCurveTo(122, 52, 110, 82, 64, 112);
      g.closePath();
    };
    const fill = g.createLinearGradient(0, 16, 0, 112);
    fill.addColorStop(0, "#ff8fb1");
    fill.addColorStop(1, "#e0245e");
    heart();
    g.fillStyle = fill;
    g.fill();
    g.lineWidth = 5;
    g.strokeStyle = "#f3cf7a";
    g.stroke();
    g.fillStyle = "rgba(255,255,255,0.75)";
    g.beginPath();
    g.ellipse(38, 38, 9, 5, -0.7, 0, Math.PI * 2);
    g.fill();
  });
}
