# Myntra Wishlist Reactivation MVP — Reference Doc

## STATUS: V2 — this replaces the earlier V1 concept
V1 was a static "price-confidence card" shown only when a user opened a
wishlisted item on their own. V2 keeps that card (see PRODUCT DETAIL SCREEN
below) but adds a proactive layer in front of it: Myntra reaches out to the
user via WhatsApp instead of waiting for them to remember to check back.

## What this is
A prototype demonstrating **proactive wishlist reactivation**: Myntra
messages the user on WhatsApp about a wishlisted item, and tapping the
message takes them straight to that item's real product page — where the
existing, honest price-context card (V1's feature) helps them decide.

## Two reactivation triggers (NOT equally evidenced — do not treat as the same strength)

### Trigger 1 — Price Drop (stronger evidence)
Fires when a wishlisted item's price has genuinely dropped. Message shows:
- Product image/name
- **Old price (struck through) → New price**, plus a small "Save ₹X" chip
  (X = Old − New, real arithmetic on the two real values below)
- CTA (e.g. "View Item")

**Old/new price rule (STRICT):** we do NOT have real day-by-day price
history — only aggregate Current/Lowest/Average/Highest per product. Do NOT
invent a specific "yesterday's price." Instead:
- **"Old price" = the product's real `Average` value**
- **"New price" = the product's real `Current` value**
This is the same honest logic already used in the existing verdict-card copy
("you'd save ₹X compared to what this usually sells for") — just delivered
proactively instead of passively.

### Trigger 2 — Staleness Reminder (weaker evidence, explicitly a hypothesis)
Fires after a wishlisted item hasn't been revisited in some time. Generic
message, no price data needed (e.g. "Still thinking about this?").
**IMPORTANT: there is no research evidence for any specific time interval.**
Whatever interval is used in the prototype (even just for demo pacing) must
be treated as a placeholder/design hypothesis, and must NOT be described
anywhere (code comments, UI text, or eventual deck copy) as validated or
research-backed. If asked to pick a number, pick one and label it clearly as
illustrative only.

## Flow (5 screens)
1. **WhatsApp message mockup screen** — shows either a Trigger 1 or Trigger
   2 message (see above). Tapping it → goes to screen 4 (that product's
   detail page), skipping the home/wishlist screens entirely — this
   simulates being pulled back into the app from outside it.
2. **Myntra home screen** (static, unchanged from V1) — still reachable via
   normal navigation/back button, kept for completeness, not the primary
   entry point anymore.
3. **Wishlist screen** (unchanged from V1) — grid of the 10 PRODUCT_DATA
   items, still reachable via normal navigation.
4. **Product detail screen** (unchanged from V1 — this is still the actual
   feature payoff): product image, name, current price, the price-context
   card (see PRODUCT DETAIL SCREEN / VERDICT LOGIC below), Add to Cart.
5. (V1's animated home-screen nudge remains as-is for the manual-navigation
   path; the WhatsApp screen is the new primary entry point for the demo.)

## PRODUCT DETAIL SCREEN — still the actual feature
- Product image, name, current price
  - When current is genuinely below average: shown with the average
    struck through and a "Save ₹X" chip (X = Average − Current). No
    "average" or "% below avg" label anywhere in this row — per the
    user's explicit call (2026-08-31), the customer-facing copy should
    lead with the ₹ amount saved, not disclose that it's an
    average-based comparison. The struck-through price alone reads as
    a normal "was" price, same as any e-commerce markdown, without
    naming the stat behind it.
- Price-context card ("Verified Low Price" / price-confidence content —
  see VERDICT LOGIC). This is a compact bordered card (badge icon +
  one-line heading + one factual sentence + a muted "Based on this
  item's own price history." caption) — the earlier horizontal
  bar-with-marker UI, and the separate Lowest/Average/Highest
  breakdown row beneath it, were both removed at the user's explicit
  request (2026-08-31): "we do not want them to know its avg... tell
  them how much they are saving." The underlying verdict computation
  (current vs. average) did not change — only what's disclosed in the
  UI did.
- Add to Cart (non-functional, visual only — same as V1)
- **No auto-order, no pre-filled one-tap purchase, no bypassing a normal
  cart/checkout path.** The user must always end up in a normal,
  user-controlled flow from here.

## VERDICT LOGIC (thresholds unchanged from V1 — do not change without asking)
% difference = (current - average) / average * 100
- % difference < -15%  → "Verified Low Price" (pink card, checkmark badge) — text: "You save ₹X on this item."
- -15% to 0%           → "Price Drop" (pink card, checkmark badge, genuinely below average) — text: "You save ₹X on this item."
- 0% to +15%           → "Typical Price" (neutral gray card, info badge, at/above average) — text names the average; no savings to report
- % difference > +15%  → "Above Average Price" (amber card, up-arrow badge) — text names the average; no savings to report
Card heading/copy updated 2026-08-31; the four % thresholds above are
untouched. No bar, marker, or Lowest/Average/Highest breakdown in the UI
anymore — the two "below average" zones' copy also dropped the word
"average" entirely and leads with the ₹ savings amount instead. The
neutral/caution zones still name the average since there's no savings
figure to lead with there.

## Verdict text rules (STRICT — unchanged)
- Only state facts about the past
- NEVER predict future prices
- NEVER use fabricated confidence scores or percentages not derived from
  the real data below
- Keep to one sentence

## Evaluator review pass (2026-08-31)
Reviewed the V2 prototype end-to-end for consistency. Two leftover-V1
issues fixed (no logic/data changes):
- **Home screen "Tap the Wishlist" onboarding tooltip + pulsing ring** —
  removed. It was V1's onboarding nudge pointing users to the Wishlist
  icon as the primary discovery path. In V2, WhatsApp is the primary
  entry point and Home/Wishlist are reachable via normal navigation only
  "for completeness" (see Flow above) — the onboarding highlight no
  longer matched the story and read as an inconsistent leftover.
- **Wishlist card action icons (remove/add-to-bag/share)** — now marked
  `disabled` and dimmed to match the same 0.65-opacity inert styling
  already used for Home's non-functional Search/Notifications/Bag icons.
  Previously these were non-functional but rendered fully opaque, which
  was visually inconsistent with the rest of the prototype's pattern for
  showing "not wired up in this demo."

Open items surfaced but NOT resolved unilaterally (need a call from the
project owner, not a design-review fix):
- **Trigger 2 (staleness reminder) is entirely unbuilt.** The prototype
  currently only demonstrates Trigger 1 (price drop). This is disclosed
  honestly in the demo wrapper itself but is the single biggest
  completeness gap.
- **"Verified Low Price" substantiation.** Since the Lowest/Average/
  Highest breakdown was removed from the product detail card (per the
  2026-08-31 savings-first copy change above), the card's "Verified" /
  "You save ₹X" claim is no longer accompanied by any visible number the
  user could use to check it — the verification is asserted, not shown.
  This sits in tension with the project's core thesis (the segment exists
  because Myntra's own price signal is opaque/unverifiable).

## Visual style
- Myntra pink/magenta (#FF3F6C or close) as primary accent
- Clean white cards, rounded corners, standard e-commerce card layout
- WhatsApp mockup screen should visually resemble a real WhatsApp Business
  message (green accent, message bubble style), clearly distinct from the
  Myntra-pink app screens

## What NOT to build (STRICT)
- No auto-order, no silent charging, no autonomous purchase — user must
  always confirm manually in a normal cart/checkout-style path
- No real WhatsApp Business API integration — the message is a static mockup
- No real price-monitoring or staleness-detection backend — both triggers
  are pre-set/simulated for the demo
- No login, no search, no other navigation beyond what's described above
- No AI-generated predictive text of any kind
- Do not present the Trigger 2 (staleness) interval as evidence-backed
  anywhere — it isn't

## PRODUCT_DATA (hardcoded, no backend, no live fetching)

| Name | Current | Lowest | Average | Highest |
|---|---|---|---|---|
| Shawl Collar Single-Breasted Overcoat | 2495 | 1295 | 2029 | 4799 |
| Slim Fit Polo Shirt | 1149 | 1029 | 1978 | 2299 |
| Nautica Linen Cotton Slim Fit Chinos | 2600 | 2600 | 5062 | 5199 |
| Cetaphil Gentle Skin Cleanser | 394 | 289 | 371 | 499 |
| KALLOS VANITY Set of 8 Lip Liquid Lipsticks | 7502 | 3200 | 7424 | 7504 |
| Essentials Rubber Print Full-Zip Hoodie Jacket | 1519 | 1289 | 1622 | 3799 |
| Men Packlite Hooded Down Jacket | 5751 | 5478 | 7304 | 13695 |
| KEF ANC Bluetooth Headphones | 21999 | 16999 | 20781 | 26999 |
| By Titan Set of 2 Verge & Sheer Mini Gift Set Perfumes | 1795 | 798 | 1700 | 1995 |
| Floral Printed Lapel Collar Shirt With Trousers | 1451 | 923 | 1299 | 1649 |

## Suggested demo examples (not mandatory, just a sensible starting point)
- **Trigger 1 (price drop) example:** Nautica Linen Cotton Slim Fit Chinos —
  Current (2600) = Lowest, genuinely below Average (5062) — a real, dramatic,
  honestly-sourced drop to show
- **Trigger 2 (staleness) example:** any other product, e.g. Slim Fit Polo
  Shirt — no price data needed for this message type
