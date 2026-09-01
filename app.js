/* ============================================================
   Myntra Wishlist MVP — App Logic
   ============================================================ */

(function () {
  'use strict';

  // ================================================================
  // PRODUCT DATA — exact values from PROJECT_CONTEXT.md PRODUCT_DATA
  // Fields: name, current, lowest, average, highest (nothing else)
  // ================================================================
  // 2026-09-01: wishlist grid display order — Floral Shirt (id 9) now
  // shown first, Overcoat (id 0) moved to last. Array order drives the
  // wishlist grid render order (buildWishlistCards iterates PRODUCTS in
  // order); ids are unchanged so PRICE_DROP_PRODUCT/STALENESS_PRODUCT
  // lookups by id are unaffected by this reorder.
  var PRODUCTS = [
    {
      id: 9,
      name: 'Floral Printed Lapel Collar Shirt With Trousers',
      current: 1451,
      lowest: 923,
      average: 1299,
      highest: 1649,
      image: 'assets/product_9.png',
      imgBg: '#F0EBE3'
    },
    {
      id: 1,
      name: 'Slim Fit Polo Shirt',
      current: 1149,
      lowest: 1029,
      average: 1978,
      highest: 2299,
      image: 'assets/product_1.png',
      imgBg: '#E3EBF0'
    },
    {
      id: 2,
      name: 'Nautica Linen Cotton Slim Fit Chinos',
      current: 2600,
      lowest: 2600,
      average: 5062,
      highest: 5199,
      image: 'assets/product_2.png',
      imgBg: '#E8E6DF'
    },
    {
      id: 3,
      name: 'Cetaphil Gentle Skin Cleanser',
      current: 394,
      lowest: 289,
      average: 371,
      highest: 499,
      image: 'assets/product_3.png',
      imgBg: '#E0EFEA'
    },
    {
      id: 4,
      name: 'KALLOS VANITY Set of 8 Lip Liquid Lipsticks',
      current: 7502,
      lowest: 3200,
      average: 7424,
      highest: 7504,
      image: 'assets/product_4.png',
      imgBg: '#F5E0E8'
    },
    {
      id: 5,
      name: 'Essentials Rubber Print Full-Zip Hoodie Jacket',
      current: 1519,
      lowest: 1289,
      average: 1622,
      highest: 3799,
      image: 'assets/product_5.png',
      imgBg: '#E2E2EC'
    },
    {
      id: 6,
      name: 'Men Packlite Hooded Down Jacket',
      current: 5751,
      lowest: 5478,
      average: 7304,
      highest: 13695,
      image: 'assets/product_6.png',
      imgBg: '#DDE5ED'
    },
    {
      id: 7,
      name: 'KEF ANC Bluetooth Headphones',
      current: 21999,
      lowest: 16999,
      average: 20781,
      highest: 26999,
      image: 'assets/product_7.png',
      imgBg: '#E5E5E5'
    },
    {
      id: 8,
      name: 'By Titan Set of 2 Verge & Sheer Mini Gift Set Perfumes',
      current: 1795,
      lowest: 798,
      average: 1700,
      highest: 1995,
      image: 'assets/product_8.png',
      imgBg: '#EDE6F0'
    },
    {
      id: 0,
      name: 'Shawl Collar Single-Breasted Overcoat',
      current: 2495,
      lowest: 1295,
      average: 2029,
      highest: 4799,
      image: 'assets/product_0.png',
      imgBg: '#EDE8E3'
    }
  ];

  // Make products accessible globally for debugging
  window.__PRODUCTS = PRODUCTS;

  // ================================================================
  // DOM REFS
  // ================================================================
  var screenWhatsapp = document.getElementById('screen-whatsapp');
  var screenWhatsapp2 = document.getElementById('screen-whatsapp-2');
  var screenWhatsappChats = document.getElementById('screen-whatsapp-chats');
  var screenNextleap = document.getElementById('screen-nextleap');
  var chatRowMyntra = document.getElementById('chat-row-myntra');
  var chatRowNextleap = document.getElementById('chat-row-nextleap');
  var btnNextleapBack = document.getElementById('btn-nextleap-back');
  var linkOpenMyntraApp = document.getElementById('link-open-myntra-app');
  var screenHome = document.getElementById('screen-home');
  var screenWishlist = document.getElementById('screen-wishlist');
  var screenProduct = document.getElementById('screen-product');
  var btnWishlist = document.getElementById('btn-wishlist');
  var wishlistNudgeWrapper = document.getElementById('wishlist-nudge-wrapper');
  var wishlistNudgeArrow = document.getElementById('wishlist-nudge-arrow');
  var btnBackHome = document.getElementById('btn-back-home');
  var btnBackWishlist = document.getElementById('btn-back-wishlist');
  var btnWaBack = document.getElementById('btn-wa-back');
  var btnWaBack2 = document.getElementById('btn-wa-back-2');
  var linkToTrigger2 = document.getElementById('link-to-trigger2');
  var linkToTrigger1 = document.getElementById('link-to-trigger1');
  var wishlistGrid = document.getElementById('wishlist-grid');
  var wishlistCountLabel = document.getElementById('wishlist-count');

  // WhatsApp mockup DOM refs (Trigger 1 — Price Drop)
  var waMessage = document.getElementById('wa-message');
  var waBubbleGreeting = document.getElementById('wa-bubble-greeting');
  var waBubbleImage = document.getElementById('wa-bubble-image');
  var waBubbleName = document.getElementById('wa-bubble-name');
  var waOldPrice = document.getElementById('wa-old-price');
  var waNewPrice = document.getElementById('wa-new-price');
  var waStealSticker = document.getElementById('wa-steal-sticker');
  var waVerdictCard = document.getElementById('wa-verdict-card');
  var waVerdictIcon = document.getElementById('wa-verdict-icon');
  var waVerdictHeading = document.getElementById('wa-verdict-heading');
  var waVerdictText = document.getElementById('wa-verdict-text');
  var waVerdictCaption = document.getElementById('wa-verdict-caption');

  // WhatsApp mockup DOM refs (Trigger 2 — Staleness Reminder)
  var waMessageStaleness = document.getElementById('wa-message-staleness');
  var waBubbleGreeting2 = document.getElementById('wa-bubble-greeting-2');
  var waBubbleImage2 = document.getElementById('wa-bubble-image-2');
  var waBubbleName2 = document.getElementById('wa-bubble-name-2');

  // Product detail DOM refs
  var productDetailTitle = document.getElementById('product-detail-title');
  var detailImage = document.getElementById('detail-image');
  var detailImageIcon = document.getElementById('detail-image-icon');
  var detailName = document.getElementById('detail-name');
  var detailPriceWas = document.getElementById('detail-price-was');
  var detailPrice = document.getElementById('detail-price');
  var detailStealSticker = document.getElementById('detail-steal-sticker');
  var verdictCard = document.getElementById('verdict-card');
  var verdictCardBadge = document.getElementById('verdict-card-badge');
  var verdictCardIcon = document.getElementById('verdict-card-icon');
  var verdictCardHeading = document.getElementById('verdict-card-heading');
  var verdictCardText = document.getElementById('verdict-card-text');
  var verdictCardCaption = document.getElementById('verdict-card-caption');

  // ================================================================
  // HELPERS
  // ================================================================
  function formatPrice(n) {
    return '₹' + n.toLocaleString('en-IN');
  }

  // Struck-through "markup" price — 2026-09-01, per the user's explicit
  // instruction: this is a decorative "was" anchor only, not the number
  // the savings claim is computed against. It's the midpoint of average
  // and highest (both real PRODUCT_DATA fields — no invented number),
  // which is why it's always >= average for every product in the
  // catalog. The real comparison baseline stays "average" everywhere
  // else: the verdict card's "Usually sells for ₹X" caption and the
  // "You are saving ₹X" text are both still computed off product.average vs.
  // product.current, completely independent of this value. The two
  // numbers are deliberately allowed to disagree — this one is for
  // show, that one is the honest claim.
  function markupPrice(product) {
    return Math.round((product.average + product.highest) / 2);
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function switchScreen(from, to, reverse) {
    from.classList.remove('active', 'slide-back');
    to.classList.remove('slide-back');
    if (reverse) {
      to.classList.add('slide-back');
    }
    to.classList.add('active');
    // Reset scroll positions
    var bodies = to.querySelectorAll('.wishlist-body, .detail-body');
    for (var i = 0; i < bodies.length; i++) {
      bodies[i].scrollTop = 0;
    }
  }

  // ================================================================
  // VERDICT LOGIC — thresholds unchanged from V1 per PROJECT_CONTEXT.md
  // % difference = (current - average) / average * 100
  //   < -15%      → "Verified Low Price"  (pink/green zone)
  //   -15% to 0%  → "Price Drop"          (pink/green zone, milder)
  //   0% to +15%  → "Typical Price"       (neutral zone)
  //   > +15%      → "Above Average Price" (neutral zone too, as of
  //                 2026-09-01 — was a distinct amber "caution" zone;
  //                 downgraded to the same gray/info treatment as
  //                 Typical Price. Reasoning: the amber+up-arrow read as
  //                 a warning right above Add to Cart, with no
  //                 equivalent softener (no strikethrough price) the way
  //                 below-average items get. Copy stays factual and
  //                 unchanged — only the visual alarm level changed, not
  //                 the disclosure. See PROJECT_CONTEXT.md for the fuller
  //                 discussion (rejected: removing the card outright —
  //                 that would make disclosure conditional on good news,
  //                 which conflicts with this project's honest-price
  //                 thesis; rejected: inventing a "higher demand"
  //                 justification — no demand data exists in
  //                 PRODUCT_DATA, so that would be fabricated).
  //
  // 2026-08-31: the two "below average" zones now lead with the ₹ savings
  // amount and never say "average" — per the user's explicit call that the
  // customer-facing copy shouldn't expose the average-based methodology,
  // only the amount they're saving. The underlying comparison (current vs.
  // average) still computes the zone/threshold; only the two savings
  // zones' COPY dropped the word "average". Neutral/caution zones aren't
  // savings claims, so they still name the average they're measured against.
  //
  // Presentation changed from a bar+marker to a compact card (see
  // renderProductDetail) — the % thresholds themselves are untouched.
  // Copy states only facts derived from real PRODUCT_DATA: no
  // predictions, no invented confidence scores, one sentence.
  // ================================================================
  var VERDICT_ICONS = {
    check: '<polyline points="4 12 9 17 20 6"/>',
    info: '<circle cx="12" cy="7.4" r="1.3" fill="#fff" stroke="none"/><line x1="12" y1="11" x2="12" y2="16.5"/>'
    // 'up' (amber caution arrow) removed 2026-09-01 — Above Average Price
    // no longer uses a distinct caution zone/icon, see VERDICT LOGIC above.
  };

  function computeVerdict(product) {
    var pctDiff = ((product.current - product.average) / product.average) * 100;
    var zoneClass, icon, heading, text;
    // 2026-09-01: real, backward-looking urgency signal for any genuine
    // savings zone (pctDiff < 0) — true when current price is within 20%
    // of the lowest ever recorded for this item (both real PRODUCT_DATA
    // fields, threshold set by the user). This is a historical
    // comparison, not a prediction about where price goes next —
    // deliberately different from the "price may not last"/fake-urgency
    // copy already rejected for the CTA (see Project_Contexr.md).
    // Revised same day from a stricter current===lowest exact match (and
    // a colored sticker) to this — the user wanted "close to lowest" to
    // count too, and wanted the urgency carried in the verdict text
    // instead of a sticker.
    var nearLowest = pctDiff < 0 && product.current <= product.lowest * 1.2;

    if (pctDiff < -15) {
      zoneClass = 'zone-green';
      icon = 'check';
      heading = 'Verified Low Price';
      text = 'You are saving ' + formatPrice(product.average - product.current) + ' on this item.';
    } else if (pctDiff < 0) {
      // Genuinely, if modestly, below average — a real saving worth stating plainly
      zoneClass = 'zone-fair';
      icon = 'check';
      heading = 'Price Drop';
      text = 'You are saving ' + formatPrice(product.average - product.current) + ' on this item.';
    } else if (pctDiff <= 15) {
      // At or above average — no savings to report vs. average, so this is
      // one of two places we name a reference price directly instead of a
      // ₹ savings amount (see the highest-price branch just below).
      // 2026-09-01: given a positive (green/check) treatment rather than
      // gray/neutral — this price isn't a warning, it's confirmed fair,
      // so it earns a reassuring tone. Distinct green hue from the pink
      // savings zones above, so it doesn't overstate as an actual deal.
      zoneClass = 'zone-typical';
      icon = 'check';
      heading = 'Typical Price';
      text = 'Right around its typical average of ' + formatPrice(product.average) + '.';
    } else {
      // Neutral gray/info treatment — still discloses the item is priced
      // above its own average, just without the amber "warning" framing.
      // See note above (2026-09-01 change from a distinct caution zone).
      zoneClass = 'zone-neutral';
      icon = 'info';
      heading = 'Above Average Price';
      text = formatPrice(product.current - product.average) + ' above its typical average of ' + formatPrice(product.average) + '.';
    }

    // Appends to either savings zone's text — one shared clause instead
    // of duplicating it in both branches above. Final wording is the
    // user's pick from 5 drafted variants (2026-09-01).
    if (nearLowest) {
      text += " It's rarely been priced this low.";
    }

    // 2026-09-01: "Typical Price" items have no savings vs. average to
    // report, but there IS a real, honest number available: the gap to
    // the item's own highest recorded price. Only worth stating when
    // that gap is meaningful — for KALLOS Lipsticks (current ₹7,502 vs.
    // highest ₹7,504) it would be a hollow ₹2 claim, so this only fires
    // when the gap is at least 10% of the highest price; below that, the
    // plain "right around average" line stays. Per the user's specified
    // structure: the main line states a ₹ savings amount (same phrasing
    // as the real savings zones), and a caption underneath discloses the
    // comparison is vs. the highest price, not average — so it can't be
    // mistaken for the real average-based "You are saving" claim used above.
    var highestGap = zoneClass === 'zone-typical' ? product.highest - product.current : 0;
    var highestGapMeaningful = zoneClass === 'zone-typical' && highestGap >= product.highest * 0.10;
    if (highestGapMeaningful) {
      text = 'You are saving ' + formatPrice(highestGap) + ' on this item.';
    }

    // 2026-09-01: no "Usually sells for ₹X" caption for the Above Average
    // zone — the average is already stated once in `text` above ("₹X
    // above its typical average of ₹Y"), so the caption would just
    // repeat the same number a second time on this one card.
    var caption;
    if (pctDiff > 15) {
      caption = '';
    } else if (highestGapMeaningful) {
      caption = 'Based on its highest recorded price of ' + formatPrice(product.highest);
    } else {
      caption = 'Usually sells for ' + formatPrice(product.average);
    }

    return {
      pctDiff: pctDiff,
      zoneClass: zoneClass,
      icon: icon,
      heading: heading,
      text: text,
      // 2026-09-01: the card's caption used to be a static "Based on this
      // item's own price history." line. Now shows the reference average
      // instead, at the user's request — same average the verdict itself
      // is computed against, just stated once here instead of in a
      // separate price-row chip. Empty for the Above Average zone — see
      // note above.
      caption: caption,
      nearLowest: nearLowest
    };
  }

  // Paints a computed verdict into one card's DOM refs — shared by the
  // product detail screen and the WhatsApp bubble so both surfaces read
  // off the exact same computeVerdict() output, never a second copy of
  // the logic or the numbers.
  function paintVerdictCard(refs, verdict) {
    var baseClasses = refs.card.className.split(' ').filter(function (c) {
      return c.indexOf('zone-') !== 0;
    });
    baseClasses.push(verdict.zoneClass);
    refs.card.className = baseClasses.join(' ');
    refs.icon.innerHTML = VERDICT_ICONS[verdict.icon];
    refs.heading.textContent = verdict.heading;
    refs.text.textContent = verdict.text;
    // Empty caption (Above Average zone) — hide the line entirely rather
    // than paint blank text into it.
    if (verdict.caption) {
      refs.caption.textContent = verdict.caption;
      refs.caption.hidden = false;
    } else {
      refs.caption.textContent = '';
      refs.caption.hidden = true;
    }
  }

  // Demo persona name for the WhatsApp greeting only — there is no login
  // system in this prototype, so this is a fixed display placeholder,
  // not a claim about real user data.
  var DEMO_USER_NAME = 'Gaurav';

  // ================================================================
  // WHATSAPP MOCKUP — TRIGGER 1: PRICE DROP
  // Per Project_Contexr.md STRICT rule: no real day-by-day price history
  // exists, so "Old price" = product.average and "New price" =
  // product.current — the same honest logic as the verdict card, just
  // delivered proactively. Only call this for a product where current is
  // genuinely below average (that's Trigger 1's defined condition) —
  // it is not a generic "show any price" renderer.
  //
  // The message also embeds the same "Verified Low Price" verdict card
  // shown on the product detail page (2026-09-01, per user sketch) —
  // same computeVerdict() output, same component, just surfaced earlier
  // in the funnel instead of requiring a click-through to see it.
  // ================================================================
  var PRICE_DROP_PRODUCT = PRODUCTS.filter(function (p) { return p.id === 2; })[0]; // Nautica chinos — current == lowest, well below average

  function renderWhatsAppPriceDrop(product) {
    waBubbleGreeting.textContent = 'Hi ' + DEMO_USER_NAME + ',';
    waBubbleImage.style.setProperty('--img-bg', product.imgBg);
    waBubbleImage.innerHTML = '<img class="wa-bubble-real-image" src="' + product.image + '" alt="' + product.name + '">';
    waBubbleName.textContent = product.name;
    waOldPrice.textContent = formatPrice(markupPrice(product));
    waNewPrice.textContent = formatPrice(product.current);

    var verdict = computeVerdict(product);

    // 2026-09-01: was a "Usually sells for ₹X" note here — that text now
    // lives in the verdict card's caption instead (see paintVerdictCard),
    // so this spot carries a "Steal Deal" sticker instead. Reserved for
    // the strongest zone only (Verified Low Price, >15% below average) —
    // calling a merely-below-average price a "steal" would overstate the
    // milder Price Drop zone, so the sticker only shows where the claim
    // actually holds. (2026-09-01: briefly had a color/label-swapped
    // "All-Time Low" variant here — the user wanted the urgency carried
    // in the verdict card's text instead, not a second sticker, see
    // computeVerdict()'s `nearLowest`.)
    waStealSticker.hidden = verdict.zoneClass !== 'zone-green';

    paintVerdictCard({
      card: waVerdictCard,
      icon: waVerdictIcon,
      heading: waVerdictHeading,
      text: waVerdictText,
      caption: waVerdictCaption
    }, verdict);
  }

  // ================================================================
  // WHATSAPP MOCKUP — TRIGGER 2: WISHLIST NUDGE
  // Rewritten 2026-09-01 from a time-based "hasn't revisited in N days"
  // reminder to a behavior-triggered one: fires when the user is
  // actively browsing the same category as something already on their
  // wishlist — a relevance signal, not a countdown. Generic message,
  // deliberately NO price data — this trigger doesn't depend on any
  // price signal, so showing price context here would misrepresent why
  // the message was sent.
  //
  // Both the old time-based and this behavior-based version are
  // simulated for this no-backend demo — neither is actually wired to
  // real elapsed time or real browsing data. The behavior-based version
  // is the stronger product idea (fires on genuine relevance rather than
  // an arbitrary clock) but trades one unproven assumption for another:
  // it assumes real-time category-matching against session activity is
  // buildable, same as the old version assumed a validated revisit
  // interval. Neither claim is backed by this project's research — see
  // Project_Contexr.md.
  //
  // Copy note: deliberately does not say "you've been browsing X" —
  // echoing the detected category back like a mail-merge variable is
  // what makes a message read as automated. The message references the
  // shopper's ongoing search instead and the specific saved item, which
  // reads as relevant without narrating the tracking mechanism. Uses a
  // different product than Trigger 1 (Nautica Chinos) so the two
  // examples are visibly distinct products.
  //
  // 2026-09-01: was Slim Fit Polo Shirt (id 1) — swapped out because
  // that product is itself ~42% below its own average (Verified Low
  // Price zone), so tapping through to its detail page showed a savings
  // card despite this trigger's WhatsApp message carrying no price
  // signal at all — misleading, since the reminder isn't about price.
  // Then briefly KALLOS Lipsticks (id 4), which sat almost exactly at
  // its own average. Now KEF ANC Bluetooth Headphones (id 7) — current
  // ₹21,999 vs average ₹20,781 (~6% above, "Typical Price" zone), still
  // consistent with a non-price-based trigger. Real data throughout.
  var STALENESS_PRODUCT = PRODUCTS.filter(function (p) { return p.id === 7; })[0]; // KEF ANC Bluetooth Headphones

  function renderWhatsAppStaleness(product) {
    waBubbleGreeting2.textContent = 'Hi ' + DEMO_USER_NAME + ',';
    waBubbleImage2.style.setProperty('--img-bg', product.imgBg);
    waBubbleImage2.innerHTML = '<img class="wa-bubble-real-image" src="' + product.image + '" alt="' + product.name + '">';
    waBubbleName2.textContent = product.name;
  }

  // ================================================================
  // RENDER PRODUCT DETAIL
  // ================================================================
  function renderProductDetail(product) {
    var verdict = computeVerdict(product);

    // Header — use product name (no invented brand)
    productDetailTitle.textContent = 'Product Details';

    // Image
    detailImage.style.setProperty('--img-bg', product.imgBg);
    detailImageIcon.innerHTML = '<img class="product-real-image" src="' + product.image + '" alt="' + product.name + '">';

    // Info — name and current price (from PRODUCT_DATA)
    detailName.textContent = product.name;
    detailPrice.textContent = formatPrice(product.current);

    // "Was" (markup) price only when current is genuinely below average —
    // showing a strikethrough otherwise would imply a discount that
    // isn't real. See markupPrice() for what this value is and isn't.
    if (verdict.pctDiff < 0) {
      detailPriceWas.textContent = formatPrice(markupPrice(product));
      detailPriceWas.hidden = false;
    } else {
      detailPriceWas.hidden = true;
    }

    // 2026-09-01: this spot used to carry a "Usually sells for ₹X" note
    // (that text now lives in the verdict card's caption below instead).
    // Now shows a "Steal Deal" sticker, reserved for the strongest zone
    // only (Verified Low Price) — same reasoning as the WhatsApp message,
    // see renderWhatsAppPriceDrop.
    detailStealSticker.hidden = verdict.zoneClass !== 'zone-green';

    // Price confidence card (replaces the old bar+marker verdict UI)
    paintVerdictCard({
      card: verdictCard,
      icon: verdictCardIcon,
      heading: verdictCardHeading,
      text: verdictCardText,
      caption: verdictCardCaption
    }, verdict);
  }

  // ================================================================
  // BUILD WISHLIST CARDS
  // Only data from PRODUCT_DATA: name and current price
  // No invented brand names, no MRP, no discount percentages
  // ================================================================
  function buildWishlistCards() {
    var fragment = document.createDocumentFragment();

    PRODUCTS.forEach(function (product) {
      var card = document.createElement('div');
      card.className = 'product-card';
      card.setAttribute('data-product-id', product.id);

      // 2026-09-01: "Price Drop!" badge on every card where current is
      // genuinely below average — real arithmetic on real PRODUCT_DATA,
      // same condition the verdict logic already uses (pctDiff < 0).
      // Deliberately covers BOTH below-average zones here (unlike the
      // WhatsApp/detail "Steal Deal" sticker, which is Verified-Low-Price
      // only) — the user's own stated condition for this badge is just
      // "current price is less than average price," so it's not scoped
      // any tighter than that.
      var priceDropBadge = product.current < product.average
        ? '<div class="card-price-drop-badge">Price Drop!</div>'
        : '';

      card.innerHTML =
        '<div class="product-card-image" style="--img-bg: ' + product.imgBg + ';">' +
          '<img class="product-real-image" src="' + product.image + '" alt="' + product.name + '">' +
          priceDropBadge +
          '<div class="card-heart">' +
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="#FF3F6C" stroke="#FF3F6C" stroke-width="2">' +
              '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>' +
            '</svg>' +
          '</div>' +
        '</div>' +
        '<div class="product-card-info">' +
          '<div class="product-card-name">' + escapeHtml(product.name) + '</div>' +
          '<div class="product-card-price-row">' +
            '<span class="product-card-price">' + formatPrice(product.current) + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="product-card-actions">' +
          '<button class="card-action-btn" aria-label="Remove" disabled onclick="event.stopPropagation()">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#696B79" stroke-width="1.8"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>' +
          '</button>' +
          '<button class="card-action-btn" aria-label="Add to bag" disabled onclick="event.stopPropagation()">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#696B79" stroke-width="1.8"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M9 6a3 3 0 0 0 6 0"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>' +
          '</button>' +
          '<button class="card-action-btn" aria-label="Share" disabled onclick="event.stopPropagation()">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#696B79" stroke-width="1.8"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.6" y1="10.5" x2="15.4" y2="6.5"/><line x1="8.6" y1="13.5" x2="15.4" y2="17.5"/></svg>' +
          '</button>' +
        '</div>';

      // Navigate to product detail on tap
      card.addEventListener('click', function () {
        renderProductDetail(product);
        switchScreen(screenWishlist, screenProduct, false);
      });

      fragment.appendChild(card);
    });

    wishlistGrid.appendChild(fragment);
  }

  // ================================================================
  // NAVIGATION
  // ================================================================

  // WhatsApp message (Trigger 1) → Product Detail, skipping Home/Wishlist
  // entirely — simulates being pulled back into the app from outside it.
  waMessage.addEventListener('click', function () {
    renderProductDetail(PRICE_DROP_PRODUCT);
    switchScreen(screenWhatsapp, screenProduct, false);
  });
  waMessage.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      waMessage.click();
    }
  });

  // WhatsApp message (Trigger 2) → Product Detail, same pattern as
  // Trigger 1 but for the wishlist-nudge example product.
  waMessageStaleness.addEventListener('click', function () {
    renderProductDetail(STALENESS_PRODUCT);
    switchScreen(screenWhatsapp2, screenProduct, false);
  });
  waMessageStaleness.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      waMessageStaleness.click();
    }
  });

  // Trigger 1 screen ↔ Trigger 2 screen — 2026-09-01: replaces the old
  // same-screen hidden-toggle tabs. Each trigger is now its own real
  // screen, reached the same way every other screen transition in this
  // app works (switchScreen), via the purpose-bar link.
  linkToTrigger2.addEventListener('click', function () {
    switchScreen(screenWhatsapp, screenWhatsapp2, false);
  });
  linkToTrigger1.addEventListener('click', function () {
    switchScreen(screenWhatsapp2, screenWhatsapp, true);
  });

  // WhatsApp Trigger 1 screen → the chat list (2026-09-01, changed from
  // going straight to the Myntra home screen — that's not how WhatsApp's
  // own back button behaves; it returns to the chat list, not to some
  // other app).
  btnWaBack.addEventListener('click', function () {
    switchScreen(screenWhatsapp, screenWhatsappChats, false);
  });

  // WhatsApp Trigger 2 screen → back to Trigger 1 (its only entry point
  // is from Trigger 1's purpose-bar link, so back returns there)
  btnWaBack2.addEventListener('click', function () {
    switchScreen(screenWhatsapp2, screenWhatsapp, true);
  });

  // Chat list → either chat (2026-09-01)
  chatRowMyntra.addEventListener('click', function () {
    switchScreen(screenWhatsappChats, screenWhatsapp, true);
  });
  chatRowNextleap.addEventListener('click', function () {
    switchScreen(screenWhatsappChats, screenNextleap, false);
  });
  btnNextleapBack.addEventListener('click', function () {
    switchScreen(screenNextleap, screenWhatsappChats, true);
  });

  // Chat list → Home (2026-09-01) — Home used to be reachable directly
  // from the Trigger 1 back-button; now that the back-button goes to the
  // chat list instead, this subtle link is what keeps the Home/Wishlist/
  // Product-detail manual-navigation path reachable at all.
  linkOpenMyntraApp.addEventListener('click', function () {
    switchScreen(screenWhatsappChats, screenHome, false);
  });

  // Home → Wishlist
  btnWishlist.addEventListener('click', function () {
    switchScreen(screenHome, screenWishlist, false);
  });

  // Home-screen nudge (2026-09-01) — most of the home screen is
  // decorative in this prototype (Buy Now / category tiles / brand
  // cards etc. aren't wired to anything). Clicking anywhere on this
  // screen other than the wishlist icon shows a brief curved arrow
  // pointing at it, nudging toward the one path that's actually built.
  var wishlistNudgeTimer = null;
  screenHome.addEventListener('click', function (e) {
    if (wishlistNudgeWrapper.contains(e.target)) {
      return; // real click on the wishlist icon — nothing to nudge
    }
    wishlistNudgeArrow.classList.remove('is-visible');
    void wishlistNudgeArrow.offsetWidth; // restart the animation if it's already mid-play
    wishlistNudgeArrow.classList.add('is-visible');
    clearTimeout(wishlistNudgeTimer);
    wishlistNudgeTimer = setTimeout(function () {
      wishlistNudgeArrow.classList.remove('is-visible');
    }, 1800);
  });

  // Wishlist → Home
  btnBackHome.addEventListener('click', function () {
    switchScreen(screenWishlist, screenHome, true);
  });

  // Product Detail → Wishlist
  btnBackWishlist.addEventListener('click', function () {
    switchScreen(screenProduct, screenWishlist, true);
  });

  // ================================================================
  // INIT
  // ================================================================
  renderWhatsAppPriceDrop(PRICE_DROP_PRODUCT);
  renderWhatsAppStaleness(STALENESS_PRODUCT);
  buildWishlistCards();
  // Reads from PRODUCTS.length directly — same pattern as the rest of
  // this file, not hardcoded.
  wishlistCountLabel.textContent = PRODUCTS.length + ' items';

})();
