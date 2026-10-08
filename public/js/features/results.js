import { BY_ID } from "../data/factors.js";
import {
    FALLBACK_SUGGESTION,
    SUGGESTIONS
} from "../data/suggestions.js";
import { state } from "../state/appState.js";
import { $, h, s } from "../utils/dom.js";

const SLICE_VARS = ["--c1", "--c2", "--c3"];

function highlight(i) {
    state.slices.forEach((element, j) => {
        element.classList.toggle(
            "dim",
            i !== null && j !== i
        );

        element.style.transform =
            j === i
                ? "translate(" +
                element.dataset.dx +
                "px," +
                element.dataset.dy +
                "px)"
                : "";
    });
}

export function toggleCard(i) {
    state.cards.forEach((card, j) => {
        const open =
            j === i
                ? !card.classList.contains("open")
                : false;

        card.classList.toggle(
            "open",
            open
        );

        card.querySelector(
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

export function renderResults(explanationData) {
    const selectedCount = state.selected.size;

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
            suggestion:
                SUGGESTIONS[item.feature] ||
                FALLBACK_SUGGESTION,
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

    state.slices = [];
    state.cards = [];

    pie.setAttribute(
        "aria-label",
        "Top contributing factors: " +
        items
            .map(
                item =>
                    `${item.name} ${item.share} percent`
            )
            .join(", ")
    );

    const cx = 130;
    const cy = 130;
    const r = 118;

    let a0 = -Math.PI / 2;

    items.forEach((item, i) => {
        const a1 =
            a0 +
            (item.share / 100) *
            Math.PI * 2;

        const point = (angle, radius) => [
            cx + radius * Math.cos(angle),
            cy + radius * Math.sin(angle)
        ];

        const [x0, y0] = point(a0, r);
        const [x1, y1] = point(a1, r);

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
                " " + y1.toFixed(2) +
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
        state.slices.push(path);

        const [tx, ty] =
            point(mid, r * 0.62);

        const text = s("text", {
            x: tx.toFixed(1),
            y: ty.toFixed(1),
            "text-anchor": "middle",
            "dominant-baseline": "central"
        });

        text.textContent =
            item.share + "%";

        pie.appendChild(text);
        a0 = a1;

        // Legend
        const li = h("li", {}, [
            h("span", {
                class: "dot"
            }),
            h("span", {
                class: "nm",
                text: item.name
            }),
            h("span", {
                class: "pc",
                text: item.share + "%"
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
            text: item.suggestion
        });

        const button = h(
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
                        text: item.name
                    }),
                    h("small", {
                        text: "From your selected factors"
                    })
                ])
            ]
        );

        button.firstChild.style.background =
            "var(" +
            SLICE_VARS[i] +
            ")";

        const chevron = s(
            "svg",
            {
                class: "chev",
                viewBox: "0 0 20 20",
                "aria-hidden": "true"
            }
        );

        chevron.appendChild(
            s("path", {
                d: "M4 7.5l6 6 6-6"
            })
        );

        button.appendChild(chevron);

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
                }, [button]),
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

        button.addEventListener(
            "click",
            () => toggleCard(i)
        );

        button.addEventListener(
            "mouseenter",
            () => highlight(i)
        );

        button.addEventListener(
            "mouseleave",
            () => highlight(null)
        );

        button.addEventListener(
            "focus",
            () => highlight(i)
        );

        button.addEventListener(
            "blur",
            () => highlight(null)
        );

        list.appendChild(card);
        state.cards.push(card);
    });

    toggleCard(0);
}
