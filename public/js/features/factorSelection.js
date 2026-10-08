import { FACTORS } from "../data/factors.js";
import { state } from "../state/appState.js";
import { $, h } from "../utils/dom.js";

export function buildFactors() {
  const root = $("groups");
  const groups = [];

  FACTORS.forEach(factor => {
    if (!groups.includes(factor.group)) {
      groups.push(factor.group);
    }
  });

  groups.forEach(groupName => {
    const cards = h("div", {
      class: "cards"
    });

    FACTORS
      .filter(factor => factor.group === groupName)
      .forEach(factor => {
        const input = h("input", {
          type: "checkbox",
          class: "sr",
          id: "f-" + factor.id,
          value: factor.id
        });

        const label = h(
          "label",
          {
            class: "card",
            for: "f-" + factor.id
          },
          [
            input,

            h("span", {
              class: "card-text"
            }, [
              h("b", {
                text: factor.name
              }),
              h("small", {
                text: factor.hint
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
              state.selected.add(factor.id);
            } else {
              state.selected.delete(factor.id);
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

export function syncCards() {
  FACTORS.forEach(factor => {
    const input = $("f-" + factor.id);

    if (!input) return;

    input.checked = state.selected.has(factor.id);

    input.parentElement.classList.toggle(
      "on",
      input.checked
    );
  });

  updateBar();
}

export function updateBar() {
  const n = state.selected.size;

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
