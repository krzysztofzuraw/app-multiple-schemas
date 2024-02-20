import {
  OrderCreatedWebhookFactory,
  isFullOrder,
} from "../../../lib/order-created-webhook-factory";

export const orderCreatedWebhook = new OrderCreatedWebhookFactory();

export default orderCreatedWebhook.createHandler((req, res, ctx) => {
  const { payload } = ctx;

  if (isFullOrder(payload)) {
    console.log(`Full order: ${payload.order?.userEmail}`);
  }

  console.log(`Id order only: ${JSON.stringify(payload.order?.id)}`);

  return res.status(200).end();
});

export const config = {
  api: {
    bodyParser: false,
  },
};
