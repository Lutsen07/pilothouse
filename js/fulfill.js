/**
 * Post-purchase fulfillment helpers (email body + access payload).
 * Used by thanks.html and by a Stripe webhook / Zapier step.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./offer.js'));
  } else {
    root.CadenceFulfill = factory(root.CadenceOffer);
  }
})(typeof self !== 'undefined' ? self : this, function (offerApi) {
  'use strict';

  function accessPayload(opts) {
    opts = opts || {};
    var offer = opts.offer || (offerApi && offerApi.getOffer ? offerApi.getOffer() : {});
    return {
      productName: offer.productName,
      sku: offer.sku,
      downloadPath: opts.downloadPath || offer.deliverablePath || 'product/ops-cadence-kit.zip',
      granted: true,
      channel: opts.channel || 'checkout'
    };
  }

  function fulfillmentEmail(opts) {
    opts = opts || {};
    var offer = opts.offer || (offerApi && offerApi.getOffer ? offerApi.getOffer() : {});
    var to = opts.to || 'buyer@example.com';
    var access = accessPayload(opts);
    var subject = 'Your ' + offer.productName + ' is ready';
    var body = [
      'Hi,',
      '',
      'Thanks for buying ' + offer.productName + ' from ' + offer.businessName + '.',
      '',
      'Download (same files as the thank-you page):',
      access.downloadPath,
      '',
      'Start with Start Here.docx. Monday scorecard is 20 minutes.',
      '',
      '— ' + (offer.businessName || 'Pilothouse')
    ].join('\n');
    return { to: to, subject: subject, body: body, sku: offer.sku };
  }

  /** Stripe-style webhook event → whether we should fulfill. */
  function shouldFulfillEvent(event) {
    if (!event || typeof event !== 'object') return false;
    var type = event.type || '';
    if (type === 'checkout.session.completed') return true;
    if (type === 'payment_intent.succeeded') return true;
    return false;
  }

  return {
    accessPayload: accessPayload,
    fulfillmentEmail: fulfillmentEmail,
    shouldFulfillEvent: shouldFulfillEvent
  };
});
