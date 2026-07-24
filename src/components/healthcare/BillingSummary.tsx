import { Card } from "../ui";
import "./Healthcare.css";

export interface BillingLineItem {
  amount: string;
  label: string;
}

export interface BillingSummaryProps {
  lineItems: BillingLineItem[];
  title?: string;
  total: string;
}

export function BillingSummary({
  lineItems,
  title = "Billing Summary",
  total,
}: BillingSummaryProps) {
  // All monetary values must be supplied by the server pricing resolver.
  // This component only displays the resolved labels and amounts it receives.
  return (
    <Card className="billing-summary" title={title}>
      <dl>
        {lineItems.map((item) => (
          <div key={item.label}>
            <dt>{item.label}</dt>
            <dd>{item.amount}</dd>
          </div>
        ))}
        <div className="billing-summary__total">
          <dt>Total</dt>
          <dd>{total}</dd>
        </div>
      </dl>
    </Card>
  );
}
