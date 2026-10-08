import { $, s } from "../utils/dom.js";
import { state } from "../state/appState.js";

export function buildNet() {
  const svg = $("net");

  const layers = [
    [30, 3],
    [115, 5],
    [205, 5],
    [290, 3]
  ];

  const pts = layers.map(
    ([x, n]) =>
      Array.from(
        { length: n },
        (_, i) => ({
          x,
          y: (200 / (n + 1)) * (i + 1)
        })
      )
  );

  let k = 0;

  for (let l = 0; l < pts.length - 1; l++) {
    pts[l].forEach(a => {
      pts[l + 1].forEach(b => {
        const attrs = {
          x1: a.x,
          y1: a.y,
          x2: b.x,
          y2: b.y
        };

        svg.appendChild(
          s("line", {
            class: "base",
            ...attrs
          })
        );

        const p = s("line", {
          class: "pulse",
          ...attrs
        });

        p.style.animationDelay =
          ((k % 9) * -0.18).toFixed(2) +
          "s";

        svg.appendChild(p);
        k++;
      });
    });
  }

  pts.forEach((layer, l) => {
    layer.forEach((p, i) => {
      const circle = s("circle", {
        cx: p.x,
        cy: p.y,
        r: l === pts.length - 1 ? 8 : 6,
        class:
          "node" +
          (l === pts.length - 1 ? " out" : "")
      });

      circle.style.animationDelay =
        ((l * 0.25) + i * 0.12).toFixed(2) +
        "s";

      svg.appendChild(circle);
    });
  });
}

const STATUS = [
  "Reading your selections",
  "Running the prediction model",
  "Analysing contributing factors",
  "Ranking the strongest factors"
];

export function startStatus() {
  let i = 0;

  $("status").textContent = STATUS[0];

  state.statusTimer = setInterval(() => {
    i = (i + 1) % STATUS.length;
    $("status").textContent = STATUS[i];
  }, 1500);
}