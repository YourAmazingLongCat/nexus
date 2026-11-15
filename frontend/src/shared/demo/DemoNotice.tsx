import { useState } from 'react';
import { demoActions } from './demoStore';
export default function DemoNotice() {
  const [confirming, setConfirming] = useState(false);
  return <aside className="nx-container py-2 small" aria-label="Demo data controls"><strong>DEMO</strong> — local browser data only. No real orders, payments or shipment.
    {' '}<button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setConfirming(true)}>Reset demo data</button>
    {confirming && <span role="alert"> Clear products, drafts, saved items, cart and orders?{' '}<button type="button" className="btn btn-sm btn-danger" onClick={() => { demoActions.reset(); setConfirming(false); }}>Confirm reset</button>{' '}<button type="button" className="btn btn-sm btn-light" onClick={() => setConfirming(false)}>Cancel</button></span>}
  </aside>;
}
