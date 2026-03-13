import React from "react";
import { useState, useMemo } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { createPaymentIntent, createOrder } from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

/**
 * Checkout form koji:
 * - traži adresu
 * - poziva backend /payment/create-payment-intent sa cart (id, quantity)
 * - potvrđuje karticu preko stripe.confirmCardPayment
 * - nakon uspjeha zove /orders (backend ponovo validira amount)
 */

function CheckoutInner({ cart, token }) {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const stripe = useStripe();
  const elements = useElements();
  const nav = useNavigate();

  const totalCents = useMemo(() => {
    return cart.reduce((acc, it) => acc + Math.round(Number(it.price) * 100) * (it.quantity || 1), 0);
  }, [cart]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!stripe || !elements) return setError("Stripe not loaded");
    if (!cart.length) return setError("Cart is empty");

    setLoading(true);
    try {
      // 1) zatraži clientSecret od backend-a
      const { data } = await createPaymentIntent({
        cart: cart.map((p) => ({ id: p.id, quantity: p.quantity || 1 })),
        currency: "eur" // ili po tvom izboru
      });

      const clientSecret = data.clientSecret;
      if (!clientSecret) throw new Error("No client secret returned");

      // 2) confirm card payment
      const card = elements.getElement(CardElement);
      const confirmRes = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            // možeš dodati ime/email ako želiš
          },
        },
      });

      if (confirmRes.error) {
        throw confirmRes.error;
      }

      if (confirmRes.paymentIntent && confirmRes.paymentIntent.status === "succeeded") {
        // 3) after success — create order in our DB (server will validate totals)
        const orderPayload = {
          products: cart.map((p) => ({ id: p.id, name: p.name, quantity: p.quantity || 1, price: p.price })),
          total: totalCents / 100, // server expects decimal amount in units (e.g. 25.99)
          address,
          paymentIntentId: confirmRes.paymentIntent.id,
        };

        await createOrder(orderPayload, token);

        // clear cart handled by parent (route redirect)
        nav("/payment-success");
      } else {
        throw new Error("Payment not successful");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Payment error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">Checkout</h1>

      <form className="form" onSubmit={handleSubmit}>
        <label>Delivery address</label>
        <input
          className="input"
          type="text"
          placeholder="Delivery address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />

        <label>Card details</label>
        <div style={{ padding: 12, border: "1px solid #ccc", borderRadius: 8, background: "#fff" }}>
          <CardElement options={{ hidePostalCode: true }} />
        </div>

        {error && <div className="error">{error}</div>}
        <button className="btn" type="submit" disabled={!stripe || loading}>
          {loading ? "Processing..." : `Pay ${(totalCents / 100).toFixed(2)} EUR`}
        </button>
      </form>
    </div>
  );
}

export default function CheckoutPageWrapper({ cart, token }) {
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK || "");
  return (
    <Elements stripe={stripePromise}>
      <CheckoutInner cart={cart} token={token} />
    </Elements>
  );
}