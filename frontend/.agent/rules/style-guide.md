---
trigger: always_on
---

Strictly adhere to the following design system for all code generation. You must use the custom Tailwind theme variables defined in the project's index.css. Do not use default Tailwind color scales (e.g., bg-gray-100) or default spacing/text sizes ask me first if its neccessary.

Colors: Use only these semantic tokens: primary, secondary, tetiary, tetiary2, border, text-main, subtext.

Typography: Use the custom fluid scales: text-h1–text-h5 for headings and text-b1–text-b3 for body text.

Spacing: Use semantic tokens p1–p5 for padding and m1–m5 for margins (e.g., p-p3, m-m2).

Implementation: Ensure all components are responsive by leveraging the existing clamp() logic built into these variables.