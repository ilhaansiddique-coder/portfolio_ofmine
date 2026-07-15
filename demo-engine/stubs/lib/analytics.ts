// Preview stubs for the engine's analytics dispatchers. They just log so you
// can confirm the right event fires at the right moment (open the dev console).

const track = (name: string) => (payload?: unknown) => {
  if (typeof window !== "undefined") {
    // eslint-disable-next-line no-console
    console.debug(`%c[track] ${name}`, "color:#e3231b;font-weight:bold", payload ?? "");
  }
};

export const trackViewItemList = track("view_item_list");
export const trackSearch = track("search");
export const trackViewContent = track("view_content");
export const trackSelectItem = track("select_item");
export const trackAddToCart = track("add_to_cart");
export const trackInitiateCheckout = track("initiate_checkout");
export const trackRemoveFromCart = track("remove_from_cart");
export const trackAddPaymentInfo = track("add_payment_info");
export const trackPurchase = track("purchase");
export const trackLead = track("lead");
