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
    tagline: 'A calm weekly rhythm for shops that live in Slack.',
    targetCustomer: '1 to 10 person ecommerce and light wholesale shops',
    promise: 'A Monday scorecard, an exception log, and 12 written ways of working. Installed in 14 days. No consultant. No warehouse software.',
    bullets: [
      'Monday scorecard you can run in 20 minutes',
      'Exception log so the same fire cannot hide twice',
      '12 Word guides from receiving through Friday close',
      'Excel workbooks for scores, exceptions, and vendor chase',
      'A calendar file you add on iPhone or Outlook',
      'Short prompts if you want help writing more SOPs'
    ],
    ctaLabel: 'Get the kit for $89',
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
    return o.ctaLabel || ('Get the kit for ' + formatPrice(o));
  }

  return {
    OFFER: OFFER,
    getOffer: getOffer,
    formatPrice: formatPrice,
    ctaText: ctaText
  };
});
