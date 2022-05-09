const log = x => (console.log(x), x);

await new Promise(res => window.onload = res);

/* let's get this party started */
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext('2d');

const TILE_PX = 32;
const w = Math.floor((160*4)/TILE_PX);
const h = Math.floor((128*4)/TILE_PX);

canvas.style.width = (canvas.width = w*TILE_PX) + 'px';
canvas.style.height = (canvas.height = h*TILE_PX) + 'px';
ctx.imageSmoothingEnabled = false;

const art = Object.fromEntries(await Promise.all(
  [
    "arrow",        "crate",       "meat",        "rip",
    "axe",          "door",        "oak",         "snek",
    "bag",          "fire",        "pine",        "sword",
    "bed",          "ghost",       "player",      "trident",
    "bow",          "grass",       "pot",         "turtle",
    "box",          "potion",      "wall",        "palm",
    "flower",       "bush",        "trees",
    "womanArmor",   "womanPurple",
    "castle",       "coin",        "crab",        "cross",
    "ent",          "eye",         "house",       "hut",
    "manBlueArmor", "manGreen",    "manHelm",
    "manHooded",    "manRedArmor", "orc",         "slime",
    "squid",        "heart_full",  "heart_empty"
  ].map(x => new Promise(res => {
    let img = new Image();
    img.src = `img/${x}.png`;
    img.onload = () => res([x, img]);
    return img;
  }))
));

const { sign, abs, floor, cos, sin, random } = Math;

let hp = 3;

let map = {};
const onMap = (x, y) => x < w && x >= 0 &&
                        y < h && y >= 0;
const mapSet = (obj, x, y) =>
  map[[floor(x), floor(y)]] = obj;
const mapNeighbors = (x, y) => {
  return [
    [x-1, y  ],
    [x+1, y  ],
    [x  , y+1],
    [x  , y-1],
  ];
}
const mapPos = obj => {
  for (const pos in map)
    if (map[pos] == obj)
      return pos.split(",").map(x => +x);
}
const mapMove = (obj, nx, ny) => {
  for (const pos in map)
    if (map[pos] == obj)
      delete map[pos];
  mapSet(obj, nx, ny);
}

/* rot should be 0..3 */
const drawTile = (art, x, y, rot=0, alpha=1) => {
  ctx.save();
  ctx.translate(floor(x)*TILE_PX + TILE_PX/2,
                floor(y)*TILE_PX + TILE_PX/2);
  ctx.rotate(floor(rot)%4 * Math.PI/2);
  ctx.globalAlpha = alpha;
  ctx.drawImage(art, TILE_PX/-2, TILE_PX/-2, TILE_PX, TILE_PX);
  ctx.globalAlpha = 1;
  ctx.restore();
}

requestAnimationFrame(function frame(now) {
  ctx.fillStyle = "rgb(47, 43, 49)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 3; i++)
    drawTile((i < hp) ? art.heart_full : art.heart_empty, i, 0);

  for (const pos in map) {
    const [x, y] = pos.split(",").map(x => +x);
    drawTile(map[pos].art, x, y);
  }

  requestAnimationFrame(frame);
});
