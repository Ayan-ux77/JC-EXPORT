export type WebsiteInquiryInput = {
  inquiryType?: string;
  vehicle?: string;
  make?: string;
  model?: string;
  year?: string;
  budget?: string;
  currency?: string;
  bodyType?: string;
  country?: string;
  port?: string;
  shipping?: string;
  quoteBasis?: "FOB" | "CIF";
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  privacyConsent: boolean;
  marketingConsent?: boolean;
};

type InquiryResponse = {
  data: {
    reference: string;
    status: string;
    lookup_token: string;
  };
  meta: {
    correlation_id?: string;
  };
};

type ErrorResponse = {
  error?: {
    code?: string;
    message?: string;
  };
};

export async function submitWebsiteInquiry(
  input: WebsiteInquiryInput,
): Promise<InquiryResponse> {
  const response = await fetch("/api/v1/inquiries", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": crypto.randomUUID(),
      "X-Correlation-ID": crypto.randomUUID(),
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
