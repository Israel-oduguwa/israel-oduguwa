"use client";

import { useState } from "react";
import { ArrowRight, Check, RotateCcw, ShieldCheck } from "lucide-react";

export function RecoveryPreview() {
  const [deliveries, setDeliveries] = useState(1);
  return (
    <div className="recovery-preview">
      <div className="recovery-heading">
        <span className="recovery-mark">
          <ShieldCheck size={18} aria-hidden="true" /> SafeStripe
        </span>
        <span className="recovery-demo-label">Webhook replay illustration</span>
      </div>
      <h3>
        Guard the business effect.
      </h3>
      <div className="recovery-flow" aria-hidden="true">
        <span>
          <Check size={14} /> Payment accepted
        </span>
        <ArrowRight size={15} />
        <span>
          <Check size={14} /> Receipt saved
        </span>
      </div>
      <div className="recovery-record">
        <div>
          <span>Example order</span>
          <code>order_demo_01</code>
        </div>
        <span className="receipt-status">
          <Check size={13} aria-hidden="true" /> Paid
        </span>
      </div>
      <div className="recovery-counts">
        <div>
          <strong key={deliveries}>{deliveries}</strong>
          <span>Webhook deliveries</span>
        </div>
        <div>
          <strong>1</strong>
          <span>Paid receipt</span>
        </div>
      </div>
      <p className="recovery-result" aria-live="polite" aria-atomic="true">
        {deliveries === 1
          ? "Try delivering the same update again."
          : `Delivery ${deliveries} is a duplicate. Paid receipt unchanged.`}
      </p>
      <div className="recovery-actions">
        <button
          type="button"
          onClick={() => setDeliveries((count) => Math.min(count + 1, 999))}
          disabled={deliveries >= 999}
        >
          Replay webhook <RotateCcw size={14} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="recovery-reset"
          onClick={() => setDeliveries(1)}
          disabled={deliveries === 1}
        >
          Reset
        </button>
      </div>
      <p className="recovery-footnote">
        A local illustration of event deduplication. The case study covers
        operation identities, worker ownership and transaction boundaries.
      </p>
    </div>
  );
}
