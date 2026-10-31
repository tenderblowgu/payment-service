'use strict';
const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/intent', async (req, res) => {
  try {
    const { amount, currency = 'usd' } = req.body;
    const intent = await stripe.paymentIntents.create({
      amount, currency, automatic_payment_methods: { enabled: true }
    });
    res.json({ clientSecret: intent.client_secret });
  } catch (e) { res.status(400).json({ error: e.message }); }
});

router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    if (event.type === 'payment_intent.succeeded') {
      console.log('Payment succeeded:', event.data.object.id);
    }
    res.json({ received: true });
  } catch (e) { res.status(400).send('Webhook error'); }
});

module.exports = router;
