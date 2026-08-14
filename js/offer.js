/**
 * Cadence Ops — single source of truth for offer, price, and copy.
 * Browser + Node (UMD). Landing and tests both consume this file.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.CadenceOffer = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var OFFER = {
    businessName: 'Pilothouse',
    productName: 'The Ops Cadence Kit',
    sku: 'cadence-kit-v1',
    priceUsd: 89,
    currency: 'USD',
    tagline: 'A weekly ops rhythm for shops that are drowning in Slack.',
    targetCustomer: '1–10 person ecommerce / light-wholesale operators',
    promise: 'Install a Monday scorecard, exception log, and 12 SOPs in 14 days — without a consultant or a WMS.',
    bullets: [
      'Monday Ops Scorecard (20 minutes, scored 0–10)',
      'Exception log so the same fire cannot hide twice',
      '12 copy-paste SOPs: receive through Friday close',
      'CSV templates for Sheets or Excel',
      'AI prompt pack to turn messy notes into SOPs',
      '14-day install calendar so it actually gets used'
    ],
    ctaLabel: 'Get the kit — $89',
    deliverablePath: 'product/ops-cadence-kit.zip',
    successPath: 'thanks.html'
  };

  function getOffer() {
    return {
      businessName: OFFER.businessName,
      productName: OFFER.productName,
      sku: OFFER.sku,
      priceUsd: OFFER.priceUsd,
      currency: OFFER.currency,
      tagline: OFFER.tagline,
      targetCustomer: OFFER.targetCustomer,
      promise: OFFER.promise,
      bullets: OFFER.bullets.slice(),
      ctaLabel: OFFER.ctaLabel,
      deliverablePath: OFFER.deliverablePath,
      successPath: OFFER.successPath
    };
  }

  function formatPrice(offer) {
    var o = offer || getOffer();
    return '$' + Number(o.priceUsd).toFixed(0);
  }

  function ctaText(offer) {
    var o = offer || getOffer();
    return 'Get the kit — ' + formatPrice(o);
  }

  return {
    OFFER: OFFER,
    getOffer: getOffer,
    formatPrice: formatPrice,
    ctaText: ctaText
  };
});
