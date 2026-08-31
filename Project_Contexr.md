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
- **Old price → New price**
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

## PRODUCT DETAIL SCREEN — unchanged from V1, still the actual feature
- Product image, name, current price
- Price-context card ("Verified Low Price" / price-confidence content —
  see VERDICT LOGIC)
- Add to Cart (non-functional, visual only — same as V1)
- **No auto-order, no pre-filled one-tap purchase, no bypassing a normal
  cart/checkout path.** The user must always end up in a normal,
  user-controlled flow from here.

## VERDICT LOGIC (unchanged from V1 — do not change without asking)
% difference = (current - average) / average * 100
- % difference < -15%  → "Steal Deal" (green zone)
- -15% to 0%           → "Fair Deal" (yellow zone, genuinely below average)
- 0% to +15%           → "Solid Pick" (yellow zone, at/above average)
- % difference > +15%  → "Wait For Drop" (orange/red zone)
Bar marker position computed relative to average, not simply between
lowest and highest.

## Verdict text rules (STRICT — unchanged)
- Only state facts about the past
- NEVER predict future prices
- NEVER use fabricated confidence scores or percentages not derived from
  the real data below
- Keep to one sentence

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
