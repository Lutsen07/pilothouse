/**
 * Checkout URL construction — isolated from HTML.
 * Payment link resolution (first match):
 *   1. opts.paymentLink
 *   2. process.env.CADENCE_STRIPE_PAYMENT_LINK (Node / server)
 *   3. global/window.CADENCE_STRIPE_PAYMENT_LINK (browser landing go-live)
 * Otherwise a documented test-mode local checkout path.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(root, require('./offer.js'));
  } else {
    root.CadenceCheckout = factory(root, root.CadenceOffer);
  }
})(typeof self !== 'undefined' ? self : (typeof global !== 'undefined' ? global : this), function (root, offerApi) {
  'use strict';

  var TEST_CHECKOUT_PATH = 'checkout.html';

  /**
   * Resolve the founder-configured Stripe Payment Link.
   * This is the shipped entry the landing page uses (via buildCheckoutUrl).
   */
  function resolvePaymentLink(explicit) {
    if (explicit != null && String(explicit).trim()) {
      return String(explicit).trim();
    }
    if (typeof process !== 'undefined' && process.env && process.env.CADENCE_STRIPE_PAYMENT_LINK) {
      var fromEnv = String(process.env.CADENCE_STRIPE_PAYMENT_LINK).trim();
      if (fromEnv) return fromEnv;
    }
    if (root && root.CADENCE_STRIPE_PAYMENT_LINK) {
      var fromWin = String(root.CADENCE_STRIPE_PAYMENT_LINK).trim();
      if (fromWin) return fromWin;
    }
    return '';
  }

  /**
   * Build the URL the Buy button should open.
   * @param {object} [opts]
   * @param {string} [opts.paymentLink] Stripe Payment Link (live or test)
   * @param {string} [opts.successUrl]
   * @param {object} [opts.offer]
   */
  function buildCheckoutUrl(opts) {
    opts = opts || {};
    var offer = opts.offer || (offerApi && offerApi.getOffer ? offerApi.getOffer() : {});
    var link = resolvePaymentLink(opts.paymentLink);
    if (link && /^https?:\/\//i.test(link)) {
      var sep = link.indexOf('?') >= 0 ? '&' : '?';
      var clientRef = encodeURIComponent(offer.sku || 'cadence-kit-v1');
      return link + sep + 'client_reference_id=' + clientRef;
    }
    var success = opts.successUrl || (offer.successPath || 'thanks.html');
    return TEST_CHECKOUT_PATH + '?sku=' + encodeURIComponent(offer.sku || '') +
      '&amount=' + encodeURIComponent(String(offer.priceUsd || '')) +
      '&success=' + encodeURIComponent(success) +
      '&mode=test';
  }

  function isHostedCheckout(url) {
    return /^https:\/\/(buy\.stripe\.com|checkout\.stripe\.com)\//i.test(url || '');
  }

  function parseCheckoutQuery(search) {
    var q = {};
    var raw = String(search || '').replace(/^\?/, '');
    if (!raw) return q;
    raw.split('&').forEach(function (pair) {
      var i = pair.indexOf('=');
      if (i < 0) q[decodeURIComponent(pair)] = '';
      else q[decodeURIComponent(pair.slice(0, i))] = decodeURIComponent(pair.slice(i + 1).replace(/\+/g, ' '));
    });
    return q;
  }

  return {
    TEST_CHECKOUT_PATH: TEST_CHECKOUT_PATH,
    resolvePaymentLink: resolvePaymentLink,
    buildCheckoutUrl: buildCheckoutUrl,
    isHostedCheckout: isHostedCheckout,
    parseCheckoutQuery: parseCheckoutQuery
  };
});
