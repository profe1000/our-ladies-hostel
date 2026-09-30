/** The estate's Paystack settings, as sent with the tenant settings (bank account) */
export interface IPaystackSettings {
  paystackEnabled?: boolean;
  paystackPublicKey?: string | null;
  paystackUsesAppKeys?: boolean;
}

/**
 * Public key to open Paystack with, or null when the estate does not collect through Paystack
 * (tenants then pay by bank transfer only). Our Ladies still uses the key built into the app
 */
export const getPaystackKey = (settings?: IPaystackSettings | null): string | null => {
  // Servers from before estates had their own Paystack settings
  if (!settings || settings.paystackEnabled === undefined) return process.env.REACT_APP_PAYSTACK_PK || null;
  if (!settings.paystackEnabled) return null;
  return settings.paystackPublicKey || (settings.paystackUsesAppKeys ? process.env.REACT_APP_PAYSTACK_PK || null : null);
};
