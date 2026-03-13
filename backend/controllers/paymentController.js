const Stripe = require("stripe");
const Product = require("../models/Product");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * createPaymentIntent(req.body = { cart: [{ id, quantity }], currency })
 * Backend će:
 * - dohvatiti proizvode iz DB po id-evima
 * - izračunati expected total (decimal) i prevesti u najmanju jedinicu (cents)
 * - usporediti sa izračunom frontend-a (frontend samo traži clientSecret; backend uzima cijene iz DB)
 * - kreirati PaymentIntent sa točnim amountom (u cents)
 */
exports.createPaymentIntent = async (req, res, next) => {
  try {
    const { cart, currency = "eur" } = req.body;
    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // map ids and quantities
    const ids = cart.map((c) => Number(c.id));
    Product.findByIds(ids, (err, products) => {
      if (err) return next(err);
      if (!products || products.length === 0) return res.status(400).json({ message: "No products found" });

      // map products by id for quick lookup
      const byId = {};
      products.forEach((p) => {
        byId[p.id] = p;
      });

      // compute expected total in the currency's smallest unit (cents)
      let expectedTotalCents = 0;
      for (let item of cart) {
        const p = byId[item.id];
        if (!p) {
          return res.status(400).json({ message: `Product id ${item.id} not found` });
        }
        const qty = Number(item.quantity || 1);
        const priceFloat = parseFloat(p.price); // p.price is DECIMAL in DB
        expectedTotalCents += Math.round(priceFloat * 100) * qty;
      }

      // create a PaymentIntent with that exact amount
      stripe.paymentIntents.create({
        amount: expectedTotalCents,
        currency,
        automatic_payment_methods: { enabled: true },
      }).then((paymentIntent) => {
        res.json({ clientSecret: paymentIntent.client_secret, amount: expectedTotalCents });
      }).catch(next);
    });
  } catch (error) {
    next(error);
  }
};