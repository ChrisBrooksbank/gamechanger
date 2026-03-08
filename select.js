// select.js

function cryptoRandom() {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] / 0x100000000; // [0, 1) with 32 bits of entropy
}

export function pickWinner(items) {
  return items[Math.floor(cryptoRandom() * items.length)];
}

export { cryptoRandom };
