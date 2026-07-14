// Preview stub for the engine API client. createOrder fakes a successful order
// so the checkout flow completes and redirects to /order/<token>.

interface OrderPayload {
  total: number;
  [key: string]: unknown;
}

export const api = {
  async createOrder(payload: OrderPayload) {
    // eslint-disable-next-line no-console
    console.debug("[api.createOrder]", payload);
    await new Promise((r) => setTimeout(r, 400));
    const token = "demo";
    return { id: Math.floor(Math.random() * 100000), total: payload.total, order_token: token };
  },
};
