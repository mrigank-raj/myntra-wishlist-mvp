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
- **Old price (struck through) → New price**, plus a "Steal Deal" sticker
  when the drop is strong enough (Verified Low Price zone only — see the
  "Steal Deal" sticker note below)
- The embedded verdict card (see "Embedded verdict card" below), whose
  caption states the reference average price
- CTA ("View This Deal")

**Old/new price rule (STRICT):** we do NOT have real day-by-day price
history — only aggregate Current/Lowest/Average/Highest per product. Do NOT
invent a specific "yesterday's price." Instead:
- **"New price" = the product's real `Current` value**
- **"Old"/markup price (struck through) = `Math.round((Average + Highest) / 2)`,
  falling back to the real `Highest` value if that midpoint isn't above
  `Current`** — revised 2026-09-01 (twice), see "Markup price is decorative"
  and "Markup price shown on every page" below. All inputs (`Average`,
  `Highest`, `Current`) are real PRODUCT_DATA fields; this is arithmetic on
  real values, not an invented number.
- **"Usually sells for ₹X" (verdict card caption) = the product's real
  `Average` value** — this, not the struck-through markup price, is the
  actual comparison baseline.

**Markup price is decorative, not the savings baseline (2026-09-01):**
the struck-through price and the "You save ₹X" claim are deliberately
**not** required to reconcile with each other. Earlier in this session I
raised a concern that showing a markup price higher than `Average` would
make the strikethrough-to-current gap disagree with the "You save ₹X"
text (e.g. Down Jacket: strikethrough implies saving ₹4,749, card states
₹1,553) — mirroring the padded-MRP-plus-understated-discount pattern
this project has otherwise avoided. The user's explicit clarification:
the markup price is "just for show" — struck through for visual effect
only, like a real MRP tag — while "Usually sells for" (Average) is what
`Current` is actually compared against, and "You save ₹X" is calculated
from that comparison alone, same as before. The two numbers are allowed
to differ; only the caption/verdict-text figures make an honesty claim,
and those are untouched — still pure `Average` vs. `Current` arithmetic,
still matching each other exactly. This is the same honest logic already
used in the existing verdict-card copy ("you'd save ₹X compared to what
this usually sells for") — just delivered proactively instead of
passively.

**Markup price shown on every product page (2026-09-01):** was previously
hidden on the product detail screen unless `Current` was below `Average`
(so it only ever appeared alongside a real discount). Per the user's
explicit instruction, it now shows on every product page, with two
guardrails surfaced and confirmed during the change:
1. **KALLOS Lipsticks bug:** the midpoint formula alone gives ₹7,464 for
   this product, which is *below* its current price of ₹7,502 — would
   have rendered a strikethrough price lower than the real price (reads
   as a price increase, not a discount). Fixed per the user's rule:
   `markupPrice()` now falls back to the item's real `Highest` (₹7,504)
   whenever the midpoint isn't above `Current`. Still a real PRODUCT_DATA
   field, still guaranteed above `Current` for every product in this
   catalog.
2. **Overcoat contradiction, explicitly hidden:** even with the fallback
   fixed, the Above Average Price zone (Overcoat is the only product in
   it) has current price ₹2,495 against a markup price of ₹3,414 — showing
   that strikethrough would imply a ₹919 discount directly next to a
   verdict card stating the item is priced *above* its own average,
   contradicting itself on the same screen. Flagged to the user before
   implementing; the user's call was to hide the markup price for this
   zone only. `renderProductDetail()` now checks `verdict.zoneClass ===
   'zone-neutral'` and hides `detail-price-was` there — the only zone
   where it's hidden as of this change.

**Message format (2026-09-01):** restructured to match a real competitor
example (a Nykaa WhatsApp price-drop message the user has screenshot
evidence of): plain greeting ("Hi there,"), a neutral framing line ("Price
update for an item on your wishlist."), a "Reply STOP to unsubscribe"
compliance line, then a native-style full-width green CTA button (icon +
"View Item") below a divider, replacing the earlier inline blue text link.
The product thumbnail + old/new price stays — Nykaa's own template is
plain text with no savings figure shown, so that part remains our own
addition, not something copied from the reference.

**Embedded verdict card (2026-09-01, per user sketch):** the WhatsApp
message now greets by name ("Hi [name],") and embeds the same "Verified
Low Price" verdict card shown on the product detail screen (checkmark
badge, heading, "You save ₹X on this item.", plus a caption — see below
for what the caption says) directly in the message body, replacing the
plain "Price update for an item on your wishlist." line. This reuses the
exact same computeVerdict() output and the same card markup as the
product detail screen (paintVerdictCard() now paints both) — no new
numbers, no new logic, just the existing verdict surfaced one step
earlier in the funnel instead of requiring a click-through to see it.
The greeting name ("Gaurav" — changed from "Mrigank" 2026-09-01, single
DEMO_USER_NAME constant) is a fixed demo-persona placeholder — there is
no login system in this prototype, so it is not a claim about real user
data.

**WhatsApp price-row chip (2026-09-01):** once the verdict card was
embedded directly below it, the price row's "Save ₹X" chip became
redundant with the verdict card's "You save ₹X on this item." line —
same number, stated twice. Changed the chip to "Usually sells for ₹X"
(= product.average, same value already shown struck-through as the
"old" price) so it adds the reference price instead of repeating the
savings. **Note: this reintroduces "average" framing in this one spot**
("usually sells for" functionally discloses the comparison is
average-based) — a deliberate, explicit reversal of the earlier
2026-08-31 decision to keep that disclosure out of user-facing copy,
made only for the WhatsApp message's price-row chip, at the user's
specific instruction. The same fix (same "Usually sells for ₹X" chip,
same rationale) was then also applied to the product detail screen's
price row, at the user's request, resolving the same redundancy there.

**"Steal Deal" sticker + verdict card caption swap (2026-09-01):** the
"Usually sells for ₹X" chip above moved into the verdict card's caption
instead — the caption was previously a static, non-dynamic line ("Based
on this item's own price history."); it now reads "Usually sells for
₹X" (X = product.average, computed once in computeVerdict() and painted
by paintVerdictCard() in both places, same shared-logic pattern as the
rest of the verdict card). The price-row spot that chip vacated now
shows a small tilted "Steal Deal" sticker instead, at the user's
request. **Scoping judgment call, not explicitly specified by the
user:** the sticker only shows for the strongest verdict zone (Verified
Low Price, >15% below average) — it's hidden for the milder Price Drop
zone (0–15% below average). Calling a marginally-below-average price a
"steal" would overstate it for that zone in a way that conflicts with
this project's honest-copy rule; "steal deal" is a stronger, more
subjective claim than "Verified Low Price" already is, so it's held to
the same bar. Worth reconsidering if the intent was for it to appear on
every below-average price.

**Greeting follow-up line (2026-09-01):** "Hi [name]," used to lead
straight into the verdict card with no transition — felt abrupt/plain.
Added one line between them: "Good news! This item from your wishlist
just got a price drop." (static copy, no product name, no numbers — the
product name is already shown in the bubble's product row above, and the
numbers belong to the verdict card right below). Went through several
rounds before landing here:
- First drafts used vague nouns ("something on your wishlist," "an item")
  to avoid repeating the product name — user's feedback: this read as
  generic mass-mail copy, not personalized, despite the casual tone.
- Tried personalizing via the real product name instead — user's next
  call: don't name the product here (it's already shown above), but it
  should still feel personal.
- Resolution: personalization doesn't require naming the item — it comes
  from centering the sentence on the user's own action ("your wishlist,"
  "this item") rather than a generic location/object reference. That's
  the same underlying lesson as Trigger 2's copywriting principle above,
  from the other direction: Trigger 2's fix was to stop naming the
  detected signal; this fix was to stop being vague about whose item it
  is. Both point at the same thing — specificity about the user's own
  relationship to the item reads as personal; naming mechanisms or using
  generic filler both read as templated, just in different ways.
- Final line is the user's own wording, sentence-cased to match the rest
  of the message's typography (the rest of the message doesn't use Title
  Case).

**"See Trigger 2" link made a solid pill button (2026-09-01):** was a
plain gray text link that only turned pink on `:hover` — which does
nothing on a touch device, so on a phone (this whole prototype's actual
context) it was easy to miss entirely, defeating its purpose of letting
an evaluator find Trigger 2 in one look. Now a solid pink pill, same
visual weight as the "Price Drop" badge next to it, visible without a
hover state. Copy/behavior unchanged. Same fix applied to its mirror,
"See Trigger 1" on the Trigger 2 screen.

**"Near-lowest" urgency signal (2026-09-01) — went through two passes.**
Raised by the user: the best case (a genuine price drop) should create
urgency, ethically — no fake countdowns, no fabricated stock/demand
claims, no predicting where price goes next (all already rejected above
for the same reasons). The lever used: a real, backward-looking fact
already in PRODUCT_DATA — how close `current` is to the recorded
`lowest`. That's a verifiable historical comparison, not a forecast, so
it doesn't fall into the same category as the rejected fake-urgency copy.

- **First pass:** fired only on an exact match (`current === lowest`,
  true for exactly one product, Nautica Chinos) and showed as a
  color-swapped "All-Time Low" sticker (deep red) in place of "Steal
  Deal". The user's follow-up correction: (a) "close to lowest" should
  count too, not just an exact match — reasoning: a price close to the
  floor is still a good deal worth the same treatment; (b) no sticker —
  the urgency should live in the verdict card's wording instead.
- **Final version:** `nearLowest` = any genuine savings zone (Price
  Drop or Verified Low Price, i.e. `pctDiff < 0`) AND `current` within
  20% of `lowest` (user-set threshold). At 20%, this currently fires for
  4 of the catalog's below-average products (Nautica Chinos 0% from
  lowest, Down Jacket ~5%, Slim Fit Polo ~12%, Hoodie ~18%) — noted to
  the user that this is most of the savings-zone catalog, not a rare
  case, and they kept the number anyway.
- No sticker anymore — the "Steal Deal" sticker is back to its original,
  unconditional strongest-zone-only behavior (text later renamed to
  "Crazy Deal!" on the Product Detail screen only — see the 2026-09-01
  note below). The urgency is one appended clause on the verdict card's
  "You save ₹X on this item." line: **"It's rarely been priced this
  low."** — the user's own wording
  ("You save ₹X on this item. One of the lowest price it has ever
  been."), reframed into 5 grammar-fixed variants, this one chosen.

**"Typical Price" given a real savings framing vs. its highest price
(2026-09-01).** Raised by the user: Typical Price cards were pure
neutral messaging — no lever pulling toward the conversion metric at
all, a "lost potential." Went through a copy round: first drafts
compared current price to `highest` directly in the sentence ("₹X less
than its highest price") — rejected, wanted something that didn't
resemble that skeleton. Landed on the user's own structure instead: the
main line states a ₹ savings amount exactly like the real savings
zones ("You save ₹X on this item."), with a caption underneath in
small text disclosing the comparison basis ("Based on its highest
recorded price of ₹Y") — reuses the same main-text-plus-caption pattern
already used everywhere else in the card, and the caption keeps this
claim from being confused with the real average-based "You save" claim
used in the Verified Low Price/Price Drop zones.
- Only fires when the gap to `highest` is meaningful — at least 10% of
  the highest price. Without this floor, KALLOS Lipsticks (current
  ₹7,502 vs. highest ₹7,504, a ₹2 gap) would get a hollow claim; it
  correctly falls back to the original plain "Right around its typical
  average of ₹X" / "Usually sells for ₹X" pairing instead. The other
  four Typical Price products (Cetaphil, KEF Headphones, Titan Perfume,
  Floral Shirt) all clear the floor and get the new framing.
- Heading stays "Typical Price" — not changed, only the body text/
  caption. Worth a second look later: "Typical Price" as a heading over
  a "You save ₹X" line reads slightly inconsistent, but that wasn't
  part of what was asked this round.

**"You save" → "You are saving" (2026-09-01).** Applied consistently to
every occurrence of the phrase (Verified Low Price, Price Drop, and the
new Typical Price highest-price framing above) — the same underlying
claim, tense change only, kept uniform across all three since they
share the exact wording pattern.

**CTA copy (2026-09-01):** "View Item" → "View This Deal" — ties the button
to the price-drop hook already shown in the message rather than being a
generic navigation label. Considered and explicitly rejected for CTR:
fake urgency copy ("price may not last") — no real data supports any
future-price claim, and the verdict-text rules already forbid predicting
future prices; fake social proof — no real view/purchase-count data exists;
a "% off" figure next to the ₹ savings — mathematically reveals the
average-based comparison, which contradicts the earlier explicit decision
to keep "average" language out of user-facing copy; emoji — neither
Nykaa's real template nor Myntra's own notification copy uses any.

### Trigger 2 — Wishlist Nudge (weaker evidence, explicitly a hypothesis)
Originally spec'd as a time-based staleness reminder ("hasn't been
revisited in some time"). **Rewritten 2026-09-01** at the user's explicit
call — his reasoning: a blind time-based reminder is more likely to drive
unsubscribes than a message tied to genuine relevance, and the original
copy read as generic/templated ("AI-ish"). The trigger is now
**behavior-based**: it fires when the user is actively browsing the same
category as something already on their wishlist, not on an elapsed-time
countdown. Still no price data shown — this trigger carries no price
signal, so showing price context would misrepresent why it was sent.

**IMPORTANT — this is still an explicit hypothesis, not evidence.** The
user's reasoning above (time-based nudges → more unsubscribes) is a
sound product instinct, not something the interviews or surveys actually
measured — treat it the same way as the old timing assumption: fine to
justify a design decision, not fine to present as a validated finding.
The behavior-based version also trades one unproven technical assumption
for another: it assumes real-time category-matching against session
browsing activity is buildable, where the old version assumed a
validated revisit interval. Neither is backed by this project's
research, and neither is actually implemented — both are simulated,
static examples for this no-backend demo.

**Copywriting principle (2026-09-01):** don't name the detected category
back to the user in the message copy (e.g. "You've been browsing
shirts — this one's already on your wishlist"). Literally restating the
tracking variable is what makes a message read as automated/mail-merged.
Reference the shopper's ongoing search naturally instead, and let the
specific saved item (shown in the message itself) carry the relevance.

**Built.** Trigger 1 and Trigger 2 are each their own real screen
(`#screen-whatsapp` and `#screen-whatsapp-2`), navigated the same way
every other screen in this app is — `switchScreen`, not a show/hide
toggle. **2026-09-01 revision:** this replaced an earlier same-screen
version where both messages lived in one DOM and a prototype-only tab
strip toggled which was visible — that approach caused a real bug on
the deployed site (a CSS cascade issue meant both messages rendered
stacked at once) and, separately, didn't match what the user asked for:
"I dint want both the messages on the same screen make screen 1 and
screen 2 with there purpose stated in one word." Each screen now has a
small purpose badge under the header (`Price Drop` / `Reminder` — one
word each, styled like the artifact wrapper's flow-track breadcrumb
badges) plus a link to jump to the other trigger's screen. A real user
would only ever receive one message, never see either the badge or the
cross-link — both are prototype-only, for demo navigation. Trigger 2's
message: product image/name (no price row, no verdict card), "Hi
[name]," greeting, "Still hunting for the right shirt? This one's
already waiting in your wishlist.", "Reply STOP to unsubscribe", then a
"Take Another Look" CTA (not "View This Deal" — there's no deal to
reference here, and not "View Item" — this ties the CTA to the framing
instead of being generic nav copy). Uses a different product than
Trigger 1 (Slim Fit Polo Shirt, id 1) so the two examples are visibly
distinct; there is no shoe product in PRODUCT_DATA, so "shirt" is used
in the copy instead of the user's original "shoes" example — same
concept, real product.

## Flow (6 screens)
1. **WhatsApp Trigger 1 screen** (`#screen-whatsapp`, default entry point)
   — Price Drop message. Tapping the message → goes to the product's
   detail screen directly, skipping home/wishlist — simulates being
   pulled back into the app from outside it. The purpose-bar link jumps
   to screen 1b.
1b. **WhatsApp Trigger 2 screen** (`#screen-whatsapp-2`) — Reminder
   message, reached only via the Trigger 1 screen's purpose-bar link (or
   back from it). Tapping the message → same product-detail click-through
   as Trigger 1, for the Trigger 2 example product.
1c. **WhatsApp chat list** (`#screen-whatsapp-chats`, 2026-09-01, added)
   — reached via either trigger screen's header back-button, which
   previously went straight to the Myntra home screen. Two chats: Myntra
   (taps back into Trigger 1) and a NextLeap easter egg (taps into
   `#screen-nextleap`, a single static message: "Congratulations, you are
   a Top Fellow! 🎉" — not tied to any real data, purely a personal nod,
   same demo-persona-placeholder logic as DEMO_USER_NAME). This screen is
   NOT the app's boot screen — `#screen-whatsapp` (Trigger 1) still is,
   unchanged; this is only reachable by navigating back from a trigger.
   A small "Open Myntra App →" link at the bottom keeps the Home/
   Wishlist/Product-detail manual-navigation path reachable — it used to
   be reachable directly from the back-button, which now goes here
   instead.
2. **Myntra home screen** (static from V1, mostly decorative in this
   prototype — category tiles, brand cards, banners, bottom-nav tabs
   aren't wired to anything) — still reachable via normal
   navigation/back button, kept for completeness, not the primary entry
   point anymore. **2026-09-01, wishlist icon in this screen's header:**
   - **Item-count badge — added, then removed same day.** First pass
     added a small pink circle on the icon showing `PRODUCTS.length`
     (same convention cart icons use in most fashion apps), read from
     real data. Fixed the Wishlist screen's own "10 items" header label
     opportunistically at the same time — it had been hardcoded text
     with no JS behind it, now reads from the same `PRODUCTS.length`
     value (this part stayed). The badge itself was then explicitly
     removed at the user's request ("remove number from wishlist heart
     icon") — no count is shown on the icon anymore; the wrapper div,
     CSS rule, DOM ref and INIT-block line were all backed out, not just
     hidden.
   - **Nudge arrow — three attempts, the first two were wrong.** Since
     most of this screen is decorative, clicking anywhere on it other
     than the wishlist icon shows a brief curved arrow with a "Click on
     wishlist" label (fades in with a small bounce, auto-hides after
     ~1.8s) pointing at the icon — a hint toward the one path that's
     actually built, for anyone clicking around expecting the rest to
     work.
     - Attempt 1 had the arrowhead landing over the search bar, nowhere
       near the icon (confirmed wrong by the user's own screenshot), and
       had no label at all.
     - Attempt 2 redesigned the SVG and anchored its own top-right
       corner to the container's top-right corner. This was verbally
       asserted here as "lands right on the icon" from screenshot
       inspection alone — that assertion was wrong. When the user asked
       directly "is the arrow pointing to wishlist button? you only tell
       me," precise measurement (via Playwright, `svg.getScreenCTM()` +
       `.matrixTransform()` on the actual path vertex, compared against
       the button's real bounding box) showed the tip landing ~9px below
       the button. **Lesson applied going forward: any claim about exact
       on-screen positioning gets confirmed with coordinate math before
       being asserted, not just eyeballed from a screenshot.**
     - Attempt 3 (final, in place now) solved backward from the actual
       goal: took the wishlist button's real bounding box, picked a
       target screen point at its center, then used
       `svg.getScreenCTM().inverse().matrixTransform()` to compute the
       exact local SVG coordinates needed for the path's tip to land
       there, and rewrote the path with those coordinates (viewBox
       extended to negative y, `overflow: visible` added so the tip can
       draw above the SVG's own box). Re-measured the same way afterward
       — tip lands within ~1-3px of the button's center, confirmed both
       by the CTM math and by screenshot. Also added the "Click on
       wishlist" label (missing in attempt 1), positioned to clear the
       nav-tabs row below it.
     - Note this partially reverses an earlier V1→V2 call: the wishlist
       icon's wrapper div was originally built for an onboarding
       highlight, then explicitly turned off when WhatsApp became the
       primary entry point in V2 ("no longer onboarding-highlighted" —
       see the wrapper's own comment in index.html). This request brings
       a nudge back, just as a click-triggered arrow rather than a
       highlight ring.
3. **Wishlist screen** — grid of the 10 PRODUCT_DATA items, still
   reachable via normal navigation. **2026-09-01:** each card now shows a
   "Price Drop!" badge (top-left, mirrors the heart icon's top-right
   placement) when `current < average` for that product — real
   arithmetic on real data, same condition the verdict logic already
   uses. Deliberately covers both below-average zones here (Verified Low
   Price and the milder Price Drop zone) — unlike the WhatsApp/detail
   "Steal Deal" sticker, which is scoped to the strongest zone only, this
   badge's condition was given explicitly by the user as just "current
   price is less than average price," so it isn't narrowed further.
4. **Product detail screen** (unchanged from V1 — this is still the actual
   feature payoff): product image, name, current price, the price-context
   card (see PRODUCT DETAIL SCREEN / VERDICT LOGIC below), Add to Cart.
5. (V1's animated home-screen nudge remains as-is for the manual-navigation
   path; the WhatsApp Trigger 1 screen is the new primary entry point for
   the demo.)

## PRODUCT DETAIL SCREEN — still the actual feature
- Product image, name, current price
  - When current is genuinely below average: shown with the markup price
    struck through (see "Markup price is decorative" above — this is
    `(Average + Highest) / 2`, not `Average`, and is not the number used
    in the savings claim). The struck-through price alone reads as a
    normal "was" price, same as any e-commerce markdown.
  - When the drop is strong enough (Verified Low Price zone only): a
    small tilted "Steal Deal" sticker next to the price. 2026-09-01: this
    spot went through two revisions — first a "Save ₹X" chip (dropped
    because it repeated the verdict card's "You save ₹X on this item."
    line), then "Usually sells for ₹X" (dropped because that text moved
    into the verdict card's caption instead — see below), now the
    sticker. See the "Steal Deal" sticker note above for why it's scoped
    to one zone only.
- Price-context card ("Verified Low Price" / price-confidence content —
  see VERDICT LOGIC). This is a compact bordered card (badge icon +
  one-line heading + one factual sentence + a caption). The caption used
  to be a static "Based on this item's own price history." line; as of
  2026-09-01 it states the reference average price instead ("Usually
  sells for ₹X") — the earlier horizontal bar-with-marker UI, and the
  separate Lowest/Average/Highest breakdown row beneath it, were both
  removed at the user's explicit request (2026-08-31): "we do not want
  them to know its avg... tell them how much they are saving." The
  underlying verdict computation (current vs. average) did not change —
  only what's disclosed in the UI did.
- Add to Cart (non-functional, visual only — same as V1)
- **No auto-order, no pre-filled one-tap purchase, no bypassing a normal
  cart/checkout path.** The user must always end up in a normal,
  user-controlled flow from here.

## VERDICT LOGIC (thresholds unchanged from V1 — do not change without asking)
% difference = (current - average) / average * 100. Table below reflects
the current state as of 2026-09-01 (colors/copy have moved since V1; the
four % thresholds themselves have not):
- % difference < -15%  → "Verified Low Price" (pink card, checkmark badge) — text: "You are saving ₹X on this item." + " It's rarely been priced this low." when current is within 20% of the item's recorded lowest.
- -15% to 0%           → "Price Drop" (pink card, checkmark badge, genuinely below average) — same text pattern as above, including the near-lowest clause when it applies.
- 0% to +15%           → "Typical Price" (green card, checkmark badge) — "You are saving ₹X on this item." vs. the item's highest recorded price, with a caption disclosing that basis, when that gap is ≥10% of the highest price; otherwise "Right around its typical average of ₹X."
- % difference > +15%  → "Above Average Price" (gray card, info badge) — names the average; no savings framing.
Card heading/copy updated 2026-08-31 and again 2026-09-01 (see the dated
notes above for the full history of each change); the four % thresholds
above are untouched. No bar, marker, or Lowest/Average/Highest breakdown in the UI
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
- ~~Trigger 2 (staleness reminder) is entirely unbuilt.~~ **Resolved
  2026-09-01** — see the "Built" note under Trigger 2 above.
- **"Verified Low Price" substantiation.** Since the Lowest/Average/
  Highest breakdown was removed from the product detail card (per the
  2026-08-31 savings-first copy change above), the card's "Verified" /
  "You save ₹X" claim is no longer accompanied by any visible number the
  user could use to check it — the verification is asserted, not shown.
  This sits in tension with the project's core thesis (the segment exists
  because Myntra's own price signal is opaque/unverifiable).

**"Above Average Price" zone softened, not removed (2026-09-01).** Raised
by the user: this card had no offsetting element (unlike below-average
items, which get a struck-through markup price) and sat right above
Add to Cart looking like a warning — could plausibly hurt the wishlist→
purchase-in-30-days metric on that item. Two alternatives were discussed
and rejected:
- **Remove the card entirely for this zone.** Rejected — this would make
  disclosure conditional on the verdict being favorable (shown for
  below-average items, silently absent for above-average ones), which
  conflicts with the project's core honest-price thesis and isn't a rare
  edge case — this exact zone fires on the Overcoat, the first card in
  the wishlist grid.
- **Reframe as a fabricated "slightly higher demand" justification.**
  Rejected — no demand/sales-velocity field exists anywhere in
  PRODUCT_DATA; this would be invented data, same category already
  rejected once for the WhatsApp CTA (fake urgency/fake social proof).
- **Decision taken:** keep the disclosure, downgrade the alarm. The zone
  now reuses the same neutral gray/info-icon treatment as "Typical
  Price" instead of its own amber/up-arrow "caution" styling — the
  `zone-caution` CSS class and the icon are removed as dead code, the
  copy is unchanged (it was already factual, not alarmist — only the
  color/icon read as a warning). Add to Cart/Buy Now stay live and
  unblocked either way. Explicitly accepted trade-off, not solved away:
  an honestly-priced-above-average item may still convert less than a
  fabricated "everything's fine" framing would — that's the real cost of
  disclosure on that one item, and the call here was to keep the
  disclosure rather than optimize around it.
- **"Typical Price" given a positive treatment (2026-09-01).** Was
  sharing the same gray/info-icon "neutral" styling as Above Average
  Price (see above). Changed to green/checkmark — a price at or up to
  15% above average isn't a warning, it's a confirmed fair price, and
  reads better with a reassuring tone. Deliberately a different green
  hue from the pink savings zones (`zone-green`/`zone-fair`) so it
  doesn't overstate as an actual discount — copy is unchanged, still
  "typical average", never "you save". New `zone-typical` CSS class;
  `zone-neutral` (gray) now belongs to Above Average Price alone.
- **Caption removed for this zone only (2026-09-01).** The card's
  caption line ("Usually sells for ₹X") was dropped for the Above
  Average zone specifically, at the user's request — the same average
  is already stated once in the card's main text ("₹X above its typical
  average of ₹Y"), so the caption was a pure repeat on this one card.
  Every other zone still shows the caption (there it's not a repeat —
  those zones' text states a savings amount, not the average itself).
  `computeVerdict()` now returns an empty `caption` for this zone, and
  `paintVerdictCard()` hides the caption element (`hidden = true`)
  rather than painting blank text into it.

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
- Do not present Trigger 2's firing condition (originally a revisit
  interval, now behavior/browsing-based) as evidence-backed anywhere —
  neither version is; both are design hypotheses

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
- **Trigger 2 (reminder) example:** KEF ANC Bluetooth Headphones (id 7) —
  current ₹21,999 vs average ₹20,781, ~6% above (Typical Price zone),
  consistent with a non-price-based trigger. **2026-09-01, changed from
  Slim Fit Polo Shirt → KALLOS Lipsticks → KEF Headphones** (user's own
  choice for this round). Polo Shirt was ~42% below its own average
  (Verified Low Price zone), so tapping through Trigger 2's message
  landed on a savings card despite the message carrying no price signal
  at all — misleading, since this trigger isn't about price. Real data
  throughout, never a contrived product. The bubble copy ("Still
  deciding on the perfect pair?") was updated to match.

- **Wishlist home page display order (2026-09-01):** Floral Printed
  Lapel Collar Shirt (id 9) now shows first in the wishlist grid;
  Shawl Collar Overcoat (id 0) moved to last. User's own request. Only
  `PRODUCTS` array order changed (`buildWishlistCards` renders in array
  order) — ids, and every filter-by-id lookup (`PRICE_DROP_PRODUCT`,
  `STALENESS_PRODUCT`), are unaffected. Both products' real data is
  unchanged and both are still reachable in the grid; this is a reorder,
  not a deletion. Note: this does mean the "Above Average Price" zone
  (Overcoat) is no longer the first card an evaluator sees — it's still
  present, just at the end of the grid.

- **Markup ("was") price shown on every product page (2026-09-01):**
  previously hidden unless current was below average. Two guardrails
  confirmed with the user before shipping: (1) `markupPrice()` now falls
  back to the item's real `Highest` value whenever the midpoint formula
  isn't above `Current` — fixes KALLOS Lipsticks, where the plain
  midpoint (₹7,464) was actually below its current price (₹7,502), which
  would have rendered a strikethrough price lower than the real price;
  (2) still explicitly hidden for the Above Average Price zone (Overcoat)
  — showing it there would imply a discount right next to a verdict card
  stating the item is priced above its own average, contradicting itself
  on the same screen.

- **"Steal Deal" → "Crazy Deal!" for zone-green, wishlist grid badge made
  zone-aware (2026-09-01):** on the user's explicit, scoped instruction
  (label/copy change only, no threshold or logic change). Changed:
  the Product Detail sticker text (`detail-steal-sticker`, still gated to
  zone-green only, same as before); the wishlist grid badge, which used
  to be one generic "Price Drop!" label for any current-below-average
  card and is now zone-aware — "Crazy Deal!" for zone-green, "Price
  Drop!" unchanged for zone-fair, no badge for zone-typical/neutral
  (same union condition as before, `pctDiff < 0`, just split by zone for
  the label). The "Verified Low Price" verdict-card heading itself is
  untouched, per the user's explicit instruction. **Not changed, flagged
  instead:** the WhatsApp Trigger 1 bubble's own sticker
  (`wa-steal-sticker`) still reads "Steal Deal" — it wasn't named in the
  user's scoped instruction, so it was deliberately left alone rather
  than assumed. This surfaced a real wording inconsistency (WhatsApp
  message vs. Product Detail page, same zone-green product). First
  confirmed with the user as intentional ("leave WhatsApp as Steal
  Deal"), then reversed the same session — user asked for "Crazy Deal!"
  on the WhatsApp sticker too. All three surfaces (WhatsApp Trigger 1
  bubble, wishlist grid badge, Product Detail sticker) now consistently
  read "Crazy Deal!" for zone-green.
