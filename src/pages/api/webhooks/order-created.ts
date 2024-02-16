import { OrderCreatedWebhookFactory } from "../../../lib/order-created-webhook-factory";

export const orderCreatedWebhookFactory = new OrderCreatedWebhookFactory();

export default orderCreatedWebhookFactory.createHandler((req, res, ctx) => {
  const { payload } = ctx;

  console.log(`Order created: ${JSON.stringify(payload)}`);

  return res.status(200).end();
});

export const config = {
  api: {
    bodyParser: false,
  },
};
