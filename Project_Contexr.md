# Myntra Wishlist Price-Confidence MVP — Reference Doc

## What this is
A prototype demonstrating one feature: when a user opens a wishlisted item, 
they see a price-confidence bar showing whether the current price is a good 
time to buy, based on real historical price data (not predictions).

## Flow (exactly 3 screens, nothing else)
1. Myntra home screen (static, non-functional except one element)
   - Looks like real Myntra: pink/magenta brand color, standard layout
   - One animated nudge (pulsing arrow or highlight) pointing at the wishlist icon
   - Tapping the wishlist icon → goes to screen 2
   - Nothing else on this screen is clickable
2. Wishlist screen (functional)
   - Standard Myntra wishlist UI (grid of product cards: image, name, price)
   - Populated with the 10 products in PRODUCT_DATA below
   - Tapping any product → goes to screen 3
3. Product detail screen (functional, this is the actual feature)
   - Product image, name, current price
   - The price-confidence bar (see VERDICT LOGIC below)
   - One short line of verdict text
   - No buy button needed, no cart, no other functionality

## PRODUCT_DATA (hardcoded, no backend, no live fetching)
[insert the 10-row table: name, current, lowest, average, highest]

## VERDICT LOGIC (this is fixed — do not change without asking)
% difference = (current - average) / average * 100

- % difference < -15%  → "Steal Deal" (green zone)
- -15% to 0%           → "Fair Deal" (yellow zone, genuinely below average — stated plainly)
- 0% to +15%           → "Solid Pick" (yellow zone, at or above average — no urgency implied)
- % difference > +15%  → "Wait For Drop" (orange/red zone)

Bar marker position = current price's location, computed relative to average, 
not simply plotted between lowest and highest.

## Verdict text rules (STRICT — do not deviate)
- Only state facts about the past ("currently X% below its typical average price")
- NEVER predict future prices ("price will likely drop soon")
- NEVER use fabricated confidence scores or percentages not derived from the real data above
- Keep to one sentence

## Visual style
- Myntra pink/magenta (#FF3F6C or close) as primary accent
- Clean white cards, rounded corners, standard e-commerce card layout
- Verdict bar: horizontal gradient track (green → yellow → orange/red), 
  circular marker at the computed position, short text below it

## What NOT to build
- No login, no cart, no checkout, no search, no other navigation
- No live scraping or external API calls — all data is static, hardcoded
- No AI-generated predictive text of any kind

## PRODUCT_DATA

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