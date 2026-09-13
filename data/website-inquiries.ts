export type WebsiteInquiryInput = {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  city?: string;
  country?: string;
  /** A catalogue listing's slug, when the buyer started from a real car. */
  vehicleSlug?: string;
  // jc-portal has one message box and one vehicle-requirement box, not a
  // column per detail -- these fold into those two server-side, in
  // app/api/v1/inquiries/route.ts, rather than being dropped on the floor.
  vehicle?: string;
  make?: string;
  model?: string;
  year?: string;
  budget?: string;
  bodyType?: string;
  subject?: string;
  port?: string;
  shipping?: string;
  message?: string;
  source?: "WEBSITE" | "CONTACT_FORM";
  privacyConsent: boolean;
};

type InquiryResponse = {
  data: {
    reference: string;
    status: string;
    received_at: string;
  };
};

type ErrorResponse = {
  error?: {
    code?: string;
    message?: string;
  };
};

/**
 * A fresh idempotency key on every submission, so a double-click or a phone
 * retrying this POST on a flaky connection reaches jc-portal as one enquiry,
 * not two that two sales agents then both reply to.
 */
export async function submitWebsiteInquiry(
  input: WebsiteInquiryInput,
): Promise<InquiryResponse> {
  const response = await fetch("/api/v1/inquiries", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": crypto.randomUUID(),
    },
    body: JSON.stringify(input),
  });
  const payload = (await response.json()) as InquiryResponse & ErrorResponse;
  if (!response.ok) {
    throw new Error(
      payload.error?.message || "We could not send your inquiry. Please try again.",
    );
  }
  return payload;
}
