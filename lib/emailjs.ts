import emailjs from '@emailjs/browser';

export interface RSVPEmailParams {
  guestName: string;
  attending: string;
  numberOfGuests: number;
  additionalGuests: string;
  dietaryRestrictions: string;
}

const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const TO_EMAIL = process.env.NEXT_PUBLIC_EMAILJS_TO_EMAIL;
const FROM_NAME = process.env.NEXT_PUBLIC_EMAILJS_FROM_NAME;

export function isEmailJSConfigured(): boolean {
  return Boolean(PUBLIC_KEY && SERVICE_ID && TEMPLATE_ID);
}

export async function sendRSVPNotification(params: RSVPEmailParams): Promise<void> {
  if (!PUBLIC_KEY || !SERVICE_ID || !TEMPLATE_ID) {
    throw new Error('EmailJS is not configured. Add NEXT_PUBLIC_EMAILJS_PUBLIC_KEY, NEXT_PUBLIC_EMAILJS_SERVICE_ID, and NEXT_PUBLIC_EMAILJS_TEMPLATE_ID to .env.local');
  }

  const templateParams = {
    guestName: params.guestName,
    attending: params.attending,
    numberOfGuests: String(params.numberOfGuests),
    additionalGuests: params.additionalGuests || '(none)',
    dietaryRestrictions: params.dietaryRestrictions || '(none)',
    ...(FROM_NAME && { from_name: FROM_NAME }),
    ...(TO_EMAIL && {
      to_email: TO_EMAIL.split(',').map((e) => e.trim()).filter(Boolean).join(','),
    }),
  };

  await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, { publicKey: PUBLIC_KEY });
}
