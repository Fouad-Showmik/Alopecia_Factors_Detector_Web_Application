import { $, s } from "../utils/dom.js";

export function buildIntro() {
  const svg = $("introArt");
  const N = 30;

  for (let i = 0; i < N; i++) {
    const t = (i + 0.5) / N;

    const x =
      (1 - t) * (1 - t) * 20 +
      2 * (1 - t) * t * 200 +
      t * t * 380;

    const y =
      (1 - t) * (1 - t) * 205 +
      2 * (1 - t) * t * 150 +
      t * t * 205;

    const lean =
      (t - 0.5) * 70 +
      Math.sin(i * 2.3) * 14;

    const len =
      90 +
      ((i * 37) % 55);

    const bend =
      Math.cos(i * 1.7) * 26;

    const d =
      "M" + x.toFixed(1) + " " + y.toFixed(1) +
      " Q" +
      (x + bend).toFixed(1) + " " +
      (y - len * 0.55).toFixed(1) +
      " " +
      (x + lean).toFixed(1) + " " +
      (y - len).toFixed(1);

    const path = s("path", {
      d,
      pathLength: "1",
      class:
        "strand" +
        (i % 6 === 2 ? " shed" : "")
    });

    const delay =
      (0.1 + (i % 10) * 0.07 +
        Math.floor(i / 10) * 0.12).toFixed(2);

    const shedDelay =
      (2.1 + (i % 5) * 0.25).toFixed(2);

    path.style.animationDelay =
      i % 6 === 2
        ? delay + "s," + shedDelay + "s"
        : delay + "s";

    svg.insertBefore(
      path,
      svg.firstChild.nextSibling
    );
  }
}