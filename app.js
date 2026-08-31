/* ============================================================
   Myntra Wishlist MVP — App Logic
   ============================================================ */

(function () {
  'use strict';

  // ================================================================
  // PRODUCT DATA — exact values from PROJECT_CONTEXT.md PRODUCT_DATA
  // Fields: name, current, lowest, average, highest (nothing else)
  // ================================================================
  var PRODUCTS = [
    {
      id: 0,
      name: 'Shawl Collar Single-Breasted Overcoat',
      current: 2495,
      lowest: 1295,
      average: 2029,
      highest: 4799,
      image: 'assets/product_0.png',
      imgBg: '#EDE8E3'
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
      id: 9,
      name: 'Floral Printed Lapel Collar Shirt With Trousers',
      current: 1451,
      lowest: 923,
      average: 1299,
      highest: 1649,
      image: 'assets/product_9.png',
      imgBg: '#F0EBE3'
    }
  ];

  // Make products accessible globally for debugging
  window.__PRODUCTS = PRODUCTS;

  // ================================================================
  // DOM REFS
  // ================================================================
  var screenWhatsapp = document.getElementById('screen-whatsapp');
  var screenHome = document.getElementById('screen-home');
  var screenWishlist = document.getElementById('screen-wishlist');
  var screenProduct = document.getElementById('screen-product');
  var btnWishlist = document.getElementById('btn-wishlist');
  var btnBackHome = document.getElementById('btn-back-home');
  var btnBackWishlist = document.getElementById('btn-back-wishlist');
  var btnWaBack = document.getElementById('btn-wa-back');
  var wishlistGrid = document.getElementById('wishlist-grid');

  // WhatsApp mockup DOM refs (Trigger 1 — Price Drop)
  var waMessage = document.getElementById('wa-message');
  var waBubbleImage = document.getElementById('wa-bubble-image');
  var waBubbleName = document.getElementById('wa-bubble-name');
  var waOldPrice = document.getElementById('wa-old-price');
  var waNewPrice = document.getElementById('wa-new-price');
  var waSaveChip = document.getElementById('wa-save-chip');

  // Product detail DOM refs
  var productDetailTitle = document.getElementById('product-detail-title');
  var detailImage = document.getElementById('detail-image');
  var detailImageIcon = document.getElementById('detail-image-icon');
  var detailName = document.getElementById('detail-name');
  var detailPriceWas = document.getElementById('detail-price-was');
  var detailPrice = document.getElementById('detail-price');
  var detailPriceSave = document.getElementById('detail-price-save');
  var verdictCard = document.getElementById('verdict-card');
  var verdictCardBadge = document.getElementById('verdict-card-badge');
  var verdictCardIcon = document.getElementById('verdict-card-icon');
  var verdictCardHeading = document.getElementById('verdict-card-heading');
  var verdictCardText = document.getElementById('verdict-card-text');

  // ================================================================
  // HELPERS
  // ================================================================
  function formatPrice(n) {
    return '₹' + n.toLocaleString('en-IN');
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
  //   > +15%      → "Above Average Price" (caution zone)
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
    info: '<circle cx="12" cy="7.4" r="1.3" fill="#fff" stroke="none"/><line x1="12" y1="11" x2="12" y2="16.5"/>',
    up: '<line x1="12" y1="18" x2="12" y2="6"/><polyline points="6 12 12 6 18 12"/>'
  };

  function computeVerdict(product) {
    var pctDiff = ((product.current - product.average) / product.average) * 100;
    var zoneClass, icon, heading, text;

    if (pctDiff < -15) {
      zoneClass = 'zone-green';
      icon = 'check';
      heading = 'Verified Low Price';
      text = 'You save ' + formatPrice(product.average - product.current) + ' on this item.';
    } else if (pctDiff < 0) {
      // Genuinely, if modestly, below average — a real saving worth stating plainly
      zoneClass = 'zone-fair';
      icon = 'check';
      heading = 'Price Drop';
      text = 'You save ' + formatPrice(product.average - product.current) + ' on this item.';
    } else if (pctDiff <= 15) {
      // At or above average — no savings to report, so this is the one place
      // we do name the average, since there's no ₹ amount to lead with instead
      zoneClass = 'zone-neutral';
      icon = 'info';
      heading = 'Typical Price';
      text = 'Right around its typical average of ' + formatPrice(product.average) + '.';
    } else {
      zoneClass = 'zone-caution';
      icon = 'up';
      heading = 'Above Average Price';
      text = formatPrice(product.current - product.average) + ' above its typical average of ' + formatPrice(product.average) + '.';
    }

    return {
      pctDiff: pctDiff,
      zoneClass: zoneClass,
      icon: icon,
      heading: heading,
      text: text
    };
  }

  // ================================================================
  // WHATSAPP MOCKUP — TRIGGER 1: PRICE DROP
  // Per Project_Contexr.md STRICT rule: no real day-by-day price history
  // exists, so "Old price" = product.average and "New price" =
  // product.current — the same honest logic as the verdict card, just
  // delivered proactively. Only call this for a product where current is
  // genuinely below average (that's Trigger 1's defined condition) —
  // it is not a generic "show any price" renderer.
  // ================================================================
  var PRICE_DROP_PRODUCT = PRODUCTS.filter(function (p) { return p.id === 2; })[0]; // Nautica chinos — current == lowest, well below average

  function renderWhatsAppPriceDrop(product) {
    waBubbleImage.style.setProperty('--img-bg', product.imgBg);
    waBubbleImage.innerHTML = '<img class="wa-bubble-real-image" src="' + product.image + '" alt="' + product.name + '">';
    waBubbleName.textContent = product.name;
    waOldPrice.textContent = formatPrice(product.average);
    waNewPrice.textContent = formatPrice(product.current);
    waSaveChip.textContent = 'Save ' + formatPrice(product.average - product.current);
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

    // "Was" price + savings chip only when current is genuinely below
    // average — showing a strikethrough otherwise would imply a discount
    // that isn't real. Chip leads with the ₹ amount saved, not a labeled
    // "average" comparison — what matters to the shopper is the saving.
    if (verdict.pctDiff < 0) {
      detailPriceWas.textContent = formatPrice(product.average);
      detailPriceWas.hidden = false;
      detailPriceSave.textContent = 'Save ' + formatPrice(product.average - product.current);
      detailPriceSave.hidden = false;
    } else {
      detailPriceWas.hidden = true;
      detailPriceSave.hidden = true;
    }

    // Price confidence card (replaces the old bar+marker verdict UI)
    verdictCard.className = 'verdict-card ' + verdict.zoneClass;
    verdictCardIcon.innerHTML = VERDICT_ICONS[verdict.icon];
    verdictCardHeading.textContent = verdict.heading;
    verdictCardText.textContent = verdict.text;
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

      card.innerHTML =
        '<div class="product-card-image" style="--img-bg: ' + product.imgBg + ';">' +
          '<img class="product-real-image" src="' + product.image + '" alt="' + product.name + '">' +
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

  // WhatsApp screen → Home (the manual-navigation fallback path; Home
  // stays reachable but is no longer the primary entry point)
  btnWaBack.addEventListener('click', function () {
    switchScreen(screenWhatsapp, screenHome, false);
  });

  // Home → Wishlist
  btnWishlist.addEventListener('click', function () {
    switchScreen(screenHome, screenWishlist, false);
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
  buildWishlistCards();

})();
