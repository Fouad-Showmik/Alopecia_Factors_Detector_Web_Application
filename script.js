/* =========================================================
   ALOPECIA FACTORS DETECTOR
   Frontend connected to the Render Flask API
   ========================================================= */

const API_BASE_URL =
  "https://alopecia-factors-detector-2dzf.onrender.com";

const FEATURE_NAMES = [
  "Hair_washing",
  "Nutritional Deficiencies",
  "Smoking",
  "Job_role",
  "Genetics",
  "Stress",
  "Libido",
  "Salary",
  "Medications & Treatments",
  "Stay_up_late",
  "Weight Loss",
  "Hair_grease",
  "Province"
];

/*
 * Display information only.
 * These names correspond exactly to the backend feature names.
 */
const FACTORS = [
  {
    id: "Hair_washing",
    group: "Hair & scalp",
    name: "Hair Cleansing Practices",
    hint: "Unusual or infrequent hair washing"
  },
  {
    id: "Hair_grease",
    group: "Hair & scalp",
    name: "Scalp Damage",
    hint: "Excessive scalp or hair greasiness"
  },
  {
    id: "Nutritional Deficiencies",
    group: "Health & lifestyle",
    name: "Nutritional Deficiencies",
    hint: "Known or suspected nutritional deficiencies"
  },
  {
    id: "Smoking",
    group: "Health & lifestyle",
    name: "Tobacco Consumption",
    hint: "Regular smoking or tobacco use"
  },
  {
    id: "Stress",
    group: "Health & lifestyle",
    name: "Psychological Stress",
    hint: "Frequent or prolonged stress"
  },
  {
    id: "Stay_up_late",
    group: "Health & lifestyle",
    name: "Sleeping Issues",
    hint: "Frequently staying awake late at night"
  },
  {
    id: "Weight Loss",
    group: "Health & lifestyle",
    name: "Weight Fluctuations",
    hint: "Recent or significant weight loss"
  },
  {
    id: "Genetics",
    group: "Personal factors",
    name: "Genetic Predisposition",
    hint: "Family history or genetic factors"
  },
  {
    id: "Medications & Treatments",
    group: "Personal factors",
    name: "Medication Issues",
    hint: "Current medications or treatments"
  },
  {
    id: "Libido",
    group: "Personal factors",
    name: "Hormonal Imbalances",
    hint: "Changes in libido or related symptoms"
  },
  {
    id: "Salary",
    group: "Background",
    name: "Financial Issues",
    hint: "Lower or financially stressful income level"
  },
  {
    id: "Job_role",
    group: "Background",
    name: "Occupational Stress",
    hint: "Work-related role or job conditions"
  },
  {
    id: "Province",
    group: "Background",
    name: "Environmental Factors",
    hint: "Province or geographic location"
  }
];

const BY_ID = Object.fromEntries(
  FACTORS.map(f => [f.id, f])
);

/*
 * One suggestion per backend feature.
 */
const SUGGESTIONS = {
  "Genetics":
    "Discuss family history and hereditary hair-loss patterns with a dermatologist.",

  "Libido":
    "If changes persist, discuss possible hormonal or health-related factors with a healthcare professional.",

  "Smoking":
    "Consider reducing or stopping tobacco use and seek support if needed.",

  "Job_role":
    "Take regular breaks and manage work-related stress through healthy routines.",

  "Medications & Treatments":
    "Review current medications with your healthcare provider before making changes.",

  "Hair_washing":
    "Use a gentle shampoo and maintain a consistent scalp-care routine.",

  "Salary":
    "Identify financial stressors and consider practical or professional support.",

  "Stay_up_late":
    "Maintain a consistent sleep schedule and aim for adequate nightly sleep.",

  "Weight Loss":
    "Avoid rapid weight changes and maintain a balanced, nutrient-rich diet.",

  "Nutritional Deficiencies":
    "Discuss suspected deficiencies with a healthcare professional before taking supplements.",

  "Hair_grease":
    "Keep the scalp clean and avoid excessive use of heavy or irritating hair products.",

  "Province":
    "Protect your scalp from prolonged sun exposure and environmental pollutants.",

  "Stress":
    "Use regular stress-management practices such as exercise, relaxation, or mindfulness."
};

const FALLBACK_SUGGESTION =
  "Consult a healthcare professional for personalised advice.";

const SLICE_VARS = ["--c1", "--c2", "--c3"];

const $ = id => document.getElementById(id);
const NS = "http://www.w3.org/2000/svg";

const selected = new Set();

let statusTimer = null;
let slices = [];
let cards = [];

const reduced =
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;


/* =========================================================
   DOM HELPERS
   ========================================================= */

function h(tag, attrs, kids) {
  const e = document.createElement(tag);

  for (const k in (attrs || {})) {
    if (k === "text") {
      e.textContent = attrs[k];
    } else if (k === "class") {
      e.className = attrs[k];
    } else {
      e.setAttribute(k, attrs[k]);
    }
  }

  (kids || []).forEach(c => e.appendChild(c));

  return e;
}

function s(tag, attrs) {
  const e = document.createElementNS(NS, tag);

  for (const k in (attrs || {})) {
    e.setAttribute(k, attrs[k]);
  }

  return e;
}


/* =========================================================
   SCREENS
   ========================================================= */

const SCREENS = [
  "intro",
  "select",
  "loading",
  "results"
];

function go(name) {
  SCREENS.forEach(n => {
    $(n).hidden = n !== name;
  });

  clearInterval(statusTimer);

  window.scrollTo(0, 0);

  const target = {
    intro: null,
    select: "selTitle",
    loading: "status",
    results: "resTitle"
  }[name];

  if (target) {
    $(target).focus({
      preventScroll: true
    });
  }

  if (name === "loading") {
    startStatus();
  }
}


/* =========================================================
   INTRO
   ========================================================= */

function buildIntro() {
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

    const p = s("path", {
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

    p.style.animationDelay =
      i % 6 === 2
        ? delay + "s," + shedDelay + "s"
        : delay + "s";

    svg.insertBefore(
      p,
      svg.firstChild.nextSibling
    );
  }
}


/* =========================================================
   FACTOR SELECTION
   ========================================================= */

function buildFactors() {
  const root = $("groups");
  const groups = [];

  FACTORS.forEach(f => {
    if (!groups.includes(f.group)) {
      groups.push(f.group);
    }
  });

  groups.forEach(groupName => {
    const cards = h("div", {
      class: "cards"
    });

    FACTORS
      .filter(f => f.group === groupName)
      .forEach(f => {

        const input = h("input", {
          type: "checkbox",
          class: "sr",
          id: "f-" + f.id,
          value: f.id
        });

        const label = h(
          "label",
          {
            class: "card",
            for: "f-" + f.id
          },
          [
            input,

            h("span", {
              class: "card-text"
            }, [
              h("b", {
                text: f.name
              }),
              h("small", {
                text: f.hint
              })
            ]),

            h("span", {
              class: "switch",
              "aria-hidden": "true"
            })
          ]
        );

        input.addEventListener(
          "change",
          () => {
            if (input.checked) {
              selected.add(f.id);
            } else {
              selected.delete(f.id);
            }

            label.classList.toggle(
              "on",
              input.checked
            );

            updateBar();
          }
        );

        cards.appendChild(label);
      });

    root.appendChild(
      h("div", {
        class: "group"
      }, [
        h("span", {
          class: "mono",
          text: groupName
        }),
        cards
      ])
    );
  });
}

function syncCards() {
  FACTORS.forEach(f => {
    const input = $("f-" + f.id);

    if (!input) return;

    input.checked = selected.has(f.id);

    input.parentElement.classList.toggle(
      "on",
      input.checked
    );
  });

  updateBar();
}

function updateBar() {
  const n = selected.size;

  $("cnt").textContent = n;

  $("cntLbl").textContent =
    n === 1
      ? "factor selected"
      : "factors selected";

  // Backend requires at least 5 "yes" values.
  $("detectBtn").disabled = n < 5;

  $("clearBtn").hidden = n === 0;

  if (n > 0 && n < 5) {
    $("cntLbl").textContent =
      `${n} selected — ${5 - n} more required`;
  }
}


/* =========================================================
   LOADING ANIMATION
   ========================================================= */

function buildNet() {
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

      const c = s("circle", {
        cx: p.x,
        cy: p.y,
        r:
          l === pts.length - 1
            ? 8
            : 6,
        class:
          "node" +
          (l === pts.length - 1
            ? " out"
            : "")
      });

      c.style.animationDelay =
        ((l * 0.25) + i * 0.12).toFixed(2) +
        "s";

      svg.appendChild(c);
    });
  });
}

const STATUS = [
  "Reading your selections",
  "Running the prediction model",
  "Analysing contributing factors",
  "Ranking the strongest factors"
];

function startStatus() {
  let i = 0;

  $("status").textContent = STATUS[0];

  statusTimer = setInterval(() => {
    i = (i + 1) % STATUS.length;
    $("status").textContent = STATUS[i];
  }, 1500);
}


/* =========================================================
   API
   ========================================================= */

function createPayload(ids) {
  const payload = {};

  FEATURE_NAMES.forEach(feature => {
    payload[feature] =
      ids.includes(feature)
        ? "yes"
        : "no";
  });

  return payload;
}

async function postJson(endpoint, payload) {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }
  );

  let data = {};

  try {
    data = await response.json();
  } catch {
    throw new Error(
      "The server returned an invalid response."
    );
  }

  if (!response.ok) {
    throw new Error(
      data.error ||
      `Request failed: ${response.status}`
    );
  }

  return data;
}

async function callPrediction(ids) {
  return postJson(
    "/predict",
    createPayload(ids)
  );
}

async function callExplanation(ids) {
  return postJson(
    "/explain",
    createPayload(ids)
  );
}


/* =========================================================
   RESULTS
   ========================================================= */

function highlight(i) {
  slices.forEach((el, j) => {
    el.classList.toggle(
      "dim",
      i !== null && j !== i
    );

    el.style.transform =
      j === i
        ? "translate(" +
        el.dataset.dx +
        "px," +
        el.dataset.dy +
        "px)"
        : "";
  });
}

function toggleCard(i) {
  cards.forEach((c, j) => {

    const open =
      j === i
        ? !c.classList.contains("open")
        : false;

    c.classList.toggle(
      "open",
      open
    );

    c.querySelector(
      ".rbtn"
    ).setAttribute(
      "aria-expanded",
      String(open)
    );
  });
}

function getDisplayName(feature) {
  const item = BY_ID[feature];

  return item
    ? item.name
    : feature.replaceAll("_", " ");
}

function renderResults(explanationData) {
  const selectedCount = selected.size;

  const features =
    (explanationData.top_features || [])
      .filter(x =>
        x &&
        x.feature &&
        Number.isFinite(
          Number(x.impact_score)
        )
      )
      .sort(
        (a, b) =>
          Number(b.impact_score) -
          Number(a.impact_score)
      )
      .slice(0, 3);

  if (!features.length) {
    throw new Error(
      "No explanation data was returned."
    );
  }

  const totalImpact =
    features.reduce(
      (sum, item) =>
        sum + Number(item.impact_score),
      0
    );

  let shares = features.map(item =>
    Math.round(
      Number(item.impact_score) /
      totalImpact *
      100
    )
  );

  const diff =
    100 -
    shares.reduce(
      (sum, value) => sum + value,
      0
    );

  shares[0] += diff;

  const items = features.map(
    (item, i) => ({
      feature: item.feature,
      name: getDisplayName(item.feature),
      suggestion: SUGGESTIONS[item.feature] || FALLBACK_SUGGESTION,
      share: shares[i]
    })
  );

  $("resSub").textContent =
    `Based on your ${selectedCount} selected factors, ` +
    `from the strongest contributor to the weakest.`;

  const pie = $("pie");
  const legend = $("legend");
  const list = $("list");

  pie.textContent = "";
  legend.textContent = "";
  list.textContent = "";

  slices = [];
  cards = [];

  pie.setAttribute(
    "aria-label",
    "Top contributing factors: " +
    items
      .map(
        x =>
          `${x.name} ${x.share} percent`
      )
      .join(", ")
  );

  const cx = 130;
  const cy = 130;
  const r = 118;

  let a0 = -Math.PI / 2;

  items.forEach((it, i) => {

    const a1 =
      a0 +
      (it.share / 100) *
      Math.PI * 2;

    const p = (a, rad) => [
      cx + rad * Math.cos(a),
      cy + rad * Math.sin(a)
    ];

    const [x0, y0] = p(a0, r);
    const [x1, y1] = p(a1, r);

    const large =
      a1 - a0 > Math.PI
        ? 1
        : 0;

    const path = s("path", {
      d:
        "M" + cx + " " + cy +
        " L" + x0.toFixed(2) +
        " " + y0.toFixed(2) +
        " A" + r + " " + r +
        " 0 " + large +
        " 1 " +
        x1.toFixed(2) +
        " " +
        y1.toFixed(2) +
        " Z",

      class: "slice"
    });

    path.style.fill =
      "var(" +
      SLICE_VARS[i] +
      ")";

    const mid =
      (a0 + a1) / 2;

    path.dataset.dx =
      (Math.cos(mid) * 7)
        .toFixed(1);

    path.dataset.dy =
      (Math.sin(mid) * 7)
        .toFixed(1);

    path.addEventListener(
      "mouseenter",
      () => highlight(i)
    );

    path.addEventListener(
      "mouseleave",
      () => highlight(null)
    );

    path.addEventListener(
      "click",
      () => toggleCard(i)
    );

    pie.appendChild(path);

    slices.push(path);

    const [tx, ty] =
      p(mid, r * 0.62);

    const text = s("text", {
      x: tx.toFixed(1),
      y: ty.toFixed(1),
      "text-anchor": "middle",
      "dominant-baseline":
        "central"
    });

    text.textContent =
      it.share + "%";

    pie.appendChild(text);

    a0 = a1;


    // Legend
    const li = h("li", {}, [
      h("span", {
        class: "dot"
      }),

      h("span", {
        class: "nm",
        text: it.name
      }),

      h("span", {
        class: "pc",
        text: it.share + "%"
      })
    ]);

    li.firstChild.style.background =
      "var(" +
      SLICE_VARS[i] +
      ")";

    legend.appendChild(li);


    // Result card
    const panelId =
      "panel-" + i;

    const summary = h("p", {
      class: "rsum",
      text: it.suggestion
    });

    const btn = h(
      "button",
      {
        class: "rbtn",
        type: "button",
        "aria-expanded": "false",
        "aria-controls": panelId
      },
      [
        h("span", {
          class: "rank",
          text: String(i + 1)
        }),

        h("span", {
          class: "rname"
        }, [
          h("b", {
            text: it.name
          }),

          h("small", {
            text:
              "From your selected factors"
          })
        ])
      ]
    );

    btn.firstChild.style.background =
      "var(" +
      SLICE_VARS[i] +
      ")";

    const chev = s(
      "svg",
      {
        class: "chev",
        viewBox: "0 0 20 20",
        "aria-hidden": "true"
      }
    );

    chev.appendChild(
      s("path", {
        d: "M4 7.5l6 6 6-6"
      })
    );

    btn.appendChild(chev);

    const body = h(
      "div",
      {
        class: "rbody"
      },
      [
        h("span", {
          class: "mono",
          text: "Suggestion"
        }),

        summary
      ]
    );

    const card = h(
      "article",
      {
        class: "rcard"
      },
      [
        h("h3", {
          class: "rhead"
        }, [btn]),

        h(
          "div",
          {
            class: "rpanel",
            id: panelId
          },
          [
            h(
              "div",
              {
                class: "rpanel-in"
              },
              [body]
            )
          ]
        )
      ]
    );

    btn.addEventListener(
      "click",
      () => toggleCard(i)
    );

    btn.addEventListener(
      "mouseenter",
      () => highlight(i)
    );

    btn.addEventListener(
      "mouseleave",
      () => highlight(null)
    );

    btn.addEventListener(
      "focus",
      () => highlight(i)
    );

    btn.addEventListener(
      "blur",
      () => highlight(null)
    );

    list.appendChild(card);
    cards.push(card);
  });

  toggleCard(0);
}


/* =========================================================
   DETECTION
   ========================================================= */

async function detect() {
  if (selected.size < 5) {
    $("err").textContent =
      "Please select at least 5 factors before detecting.";

    $("err").hidden = false;

    return;
  }

  $("err").hidden = true;

  go("loading");

  try {

    const explanationData =
      await callExplanation(
        Array.from(selected)
      );

    renderResults(explanationData);

    go("results");

  } catch (error) {

    console.error(
      "Detection error:",
      error
    );

    go("select");

    $("err").textContent =
      error.message ||
      "The detector could not be reached. Please try again.";

    $("err").hidden = false;
  }
}


/* =========================================================
   INITIALIZATION
   ========================================================= */

buildIntro();
buildFactors();
buildNet();
updateBar();


/* =========================================================
   BUTTONS
   ========================================================= */

$("beginBtn").addEventListener(
  "click",
  () => go("select")
);

$("clearBtn").addEventListener(
  "click",
  () => {
    selected.clear();
    syncCards();
  }
);

$("detectBtn").addEventListener(
  "click",
  detect
);

$("editBtn").addEventListener(
  "click",
  () => go("select")
);

$("restartBtn").addEventListener(
  "click",
  () => {
    selected.clear();
    syncCards();
    go("select");
  }
);


if (reduced) {
  go("select");
}