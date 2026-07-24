import { BillingSummary, CareRequestCard } from "../components/healthcare";

const validBillingSummary = (
  <BillingSummary lineItems={[{ amount: "Server value", label: "Resolved line item" }]} total="Server total" />
);
void validBillingSummary;

// @ts-expect-error BillingSummary requires a server-resolved total.
const missingResolvedTotal = <BillingSummary lineItems={[]} />;
void missingResolvedTotal;

// @ts-expect-error BillingSummary does not accept client-side quantity inputs.
const calculatedQuantityBilling = <BillingSummary lineItems={[]} quantity={2} total="Server total" />;
void calculatedQuantityBilling;

// @ts-expect-error BillingSummary does not accept client-side unit price inputs.
const calculatedUnitPriceBilling = <BillingSummary lineItems={[]} total="Server total" unitPriceCents={1000} />;
void calculatedUnitPriceBilling;

// @ts-expect-error Laboratory requests cannot accept estimated pricing inputs.
const laboratoryEstimatedPricing = <CareRequestCard estimatedPrice="$1" providerReviewState="not-reviewed" requestId="REQ-TYPE" service="laboratory" status="submitted" submittedDate="Today" summary="Lab collection request." title="Lab request" />;
void laboratoryEstimatedPricing;
