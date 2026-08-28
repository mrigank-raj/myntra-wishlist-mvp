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
      icon: '🧥',
      imgBg: '#EDE8E3'
    },
    {
      id: 1,
      name: 'Slim Fit Polo Shirt',
      current: 1149,
      lowest: 1029,
      average: 1978,
      highest: 2299,
      icon: '👕',
      imgBg: '#E3EBF0'
    },
    {
      id: 2,
      name: 'Nautica Linen Cotton Slim Fit Chinos',
      current: 2600,
      lowest: 2600,
      average: 5062,
      highest: 5199,
      icon: '👖',
      imgBg: '#E8E6DF'
    },
    {
      id: 3,
      name: 'Cetaphil Gentle Skin Cleanser',
      current: 394,
      lowest: 289,
      average: 371,
      highest: 499,
      icon: '🧴',
      imgBg: '#E0EFEA'
    },
    {
      id: 4,
      name: 'KALLOS VANITY Set of 8 Lip Liquid Lipsticks',
      current: 7502,
      lowest: 3200,
      average: 7424,
      highest: 7504,
      icon: '💄',
      imgBg: '#F5E0E8'
    },
    {
      id: 5,
      name: 'Essentials Rubber Print Full-Zip Hoodie Jacket',
      current: 1519,
      lowest: 1289,
      average: 1622,
      highest: 3799,
      icon: '🧥',
      imgBg: '#E2E2EC'
    },
    {
      id: 6,
      name: 'Men Packlite Hooded Down Jacket',
      current: 5751,
      lowest: 5478,
      average: 7304,
      highest: 13695,
      icon: '🧥',
      imgBg: '#DDE5ED'
    },
    {
      id: 7,
      name: 'KEF ANC Bluetooth Headphones',
      current: 21999,
      lowest: 16999,
      average: 20781,
      highest: 26999,
      icon: '🎧',
      imgBg: '#E5E5E5'
    },
    {
      id: 8,
      name: 'By Titan Set of 2 Verge & Sheer Mini Gift Set Perfumes',
      current: 1795,
      lowest: 798,
      average: 1700,
      highest: 1995,
      icon: '🧴',
      imgBg: '#EDE6F0'
    },
    {
      id: 9,
      name: 'Floral Printed Lapel Collar Shirt With Trousers',
      current: 1451,
      lowest: 923,
      average: 1299,
      highest: 1649,
      icon: '👔',
      imgBg: '#F0EBE3'
    }
  ];

  // Make products accessible globally for debugging
  window.__PRODUCTS = PRODUCTS;

  // ================================================================
  // DOM REFS
  // ================================================================
  var screenHome = document.getElementById('screen-home');
  var screenWishlist = document.getElementById('screen-wishlist');
  var screenProduct = document.getElementById('screen-product');
  var btnWishlist = document.getElementById('btn-wishlist');
  var btnBackHome = document.getElementById('btn-back-home');
  var btnBackWishlist = document.getElementById('btn-back-wishlist');
  var wishlistGrid = document.getElementById('wishlist-grid');

  // Product detail DOM refs
  var productDetailTitle = document.getElementById('product-detail-title');
  var detailImage = document.getElementById('detail-image');
  var detailImageIcon = document.getElementById('detail-image-icon');
  var detailName = document.getElementById('detail-name');
  var detailPrice = document.getElementById('detail-price');
  var verdictMarker = document.getElementById('verdict-marker');
  var markerPriceLabel = document.getElementById('marker-price-label');
  var verdictBadge = document.getElementById('verdict-badge');
  var verdictBadgeDot = document.getElementById('verdict-badge-dot');
  var verdictBadgeText = document.getElementById('verdict-badge-text');
  var verdictText = document.getElementById('verdict-text');
  var detailLowest = document.getElementById('detail-lowest');
  var detailAverage = document.getElementById('detail-average');
  var detailHighest = document.getElementById('detail-highest');
  var averageLabel = document.getElementById('average-label');

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
  // VERDICT LOGIC — exactly per PROJECT_CONTEXT.md
  // % difference = (current - average) / average * 100
  //   < -15%  → "Steal Deal"  (green)
  //   -15% to +15% → "Okay, fair price" (yellow)
  //   > +15%  → "Consider waiting"  (orange/red)
  //
  // Bar marker position = current price's location relative to average
  // ================================================================
  function computeVerdict(product) {
    var pctDiff = ((product.current - product.average) / product.average) * 100;
    var absPctDiff = Math.abs(pctDiff);
    var roundedPct = Math.round(absPctDiff);

    var zone, label, badgeClass, text;

    if (pctDiff < -15) {
      zone = 'green';
      label = 'Steal Deal';
      badgeClass = 'verdict-green';
      var savings = product.average - product.current;
      text = "You'd save " + formatPrice(savings) + ' compared to what this usually sells for.';
      // Second line only if current is within 15% of the lowest-to-highest range
      var range = product.highest - product.lowest;
      if (range > 0 && ((product.current - product.lowest) / range) <= 0.15) {
        var gapToLowest = product.current - product.lowest;
        text += '\nJust ' + formatPrice(gapToLowest) + ' away from its lowest recorded price.';
      }
    } else if (pctDiff > 15) {
      zone = 'red';
      label = 'Consider waiting';
      badgeClass = 'verdict-red';
      var overpay = product.current - product.average;
      text = "You'd pay " + formatPrice(overpay) + ' more than its typical price of ' + formatPrice(product.average) + '.';
      text += "\nWaiting could bring it back down, but that isn't guaranteed.";
    } else {
      zone = 'yellow';
      label = 'Okay, fair price';
      badgeClass = 'verdict-yellow';
      text = 'This is close to what it typically sells for (avg ' + formatPrice(product.average) + ').';
    }

    // Bar and average tick positions based on real range
    var range = product.highest - product.lowest;
    var barPosition = 50; // default
    var avgPosition = 50;
    
    if (range > 0) {
      // Inverted logic: Left = High, Right = Low
      barPosition = 100 - (((product.current - product.lowest) / range) * 100);
      avgPosition = 100 - (((product.average - product.lowest) / range) * 100);
    }

    // Clamp between 4% and 96% so markers stay visible on bar edges
    barPosition = Math.max(4, Math.min(96, barPosition));
    avgPosition = Math.max(4, Math.min(96, avgPosition));

    return {
      pctDiff: pctDiff,
      zone: zone,
      label: label,
      badgeClass: badgeClass,
      text: text,
      barPosition: barPosition,
      avgPosition: avgPosition
    };
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
    detailImageIcon.textContent = product.icon;

    // Info — only name and current price (from PRODUCT_DATA)
    detailName.textContent = product.name;
    detailPrice.textContent = formatPrice(product.current);

    // Verdict bar and average marker positions
    verdictMarker.style.left = verdict.barPosition + '%';
    markerPriceLabel.textContent = formatPrice(product.current);
    
    // Prevent marker label from overflowing edges horizontally
    if (verdict.barPosition < 15) {
      markerPriceLabel.style.transform = 'translateX(0)'; // align left edge
    } else if (verdict.barPosition > 85) {
      markerPriceLabel.style.transform = 'translateX(-100%)'; // align right edge
    } else {
      markerPriceLabel.style.transform = 'translateX(-50%)'; // center align
    }
    
    if (averageLabel) {
      averageLabel.style.left = verdict.avgPosition + '%';
      
      // Prevent average label from overlapping High/Low text
      // Use querySelector to ensure it works even if index.html is cached and missing IDs
      const labelHigh = document.getElementById('label-high') || document.querySelector('.verdict-bar-labels span:first-child');
      const labelLow = document.getElementById('label-low') || document.querySelector('.verdict-bar-labels span:last-child');
      
      // Force extra padding on the container to prevent vertical overlap with title even if CSS is cached
      const barContainer = document.querySelector('.verdict-bar-container');
      if (barContainer) {
        barContainer.style.paddingTop = '24px';
      }

      if (verdict.avgPosition < 15) {
        averageLabel.style.transform = 'translateX(0)';
        if (labelHigh) labelHigh.style.opacity = '0';
        if (labelLow) labelLow.style.opacity = '1';
      } else if (verdict.avgPosition > 85) {
        averageLabel.style.transform = 'translateX(-100%)';
        if (labelHigh) labelHigh.style.opacity = '1';
        if (labelLow) labelLow.style.opacity = '0';
      } else {
        averageLabel.style.transform = 'translateX(-50%)';
        if (labelHigh) labelHigh.style.opacity = '1';
        if (labelLow) labelLow.style.opacity = '1';
      }
    }

    // Verdict badge
    verdictBadge.className = 'verdict-badge ' + verdict.badgeClass;
    verdictBadgeText.textContent = verdict.label;

    // Verdict text
    verdictText.textContent = verdict.text;

    // Price range (all from PRODUCT_DATA: lowest, average, highest)
    detailLowest.textContent = formatPrice(product.lowest);
    detailAverage.textContent = formatPrice(product.average);
    detailHighest.textContent = formatPrice(product.highest);
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
        '<div class="product-card-image" style="--img-bg: ' + product.imgBg + '">' +
          '<span class="product-card-image-icon">' + product.icon + '</span>' +
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
  buildWishlistCards();

})();
