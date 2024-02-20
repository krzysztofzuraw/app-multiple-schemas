import {
  OrderCreatedWebhookFactory,
  isFullOrder,
} from "../../../lib/order-created-webhook-factory";
import { SaleorAPIFactory } from "../../../lib/saleor-api-factory";

const mockedVersion = 3.15;

export const orderCreatedWebhook = new OrderCreatedWebhookFactory();

export default orderCreatedWebhook.createHandler((req, res, ctx) => {
  const { payload, authData } = ctx;

  const saleorAPI = new SaleorAPIFactory(authData.saleorApiUrl, authData.token);

  if (isFullOrder(payload)) {
    console.log(`Full order: ${payload.order?.userEmail}`);
    saleorAPI.getOrder({
      version: mockedVersion,
      externalReference: payload.order?.externalReference ?? "",
    });
  }

  console.log(`Id order only: ${JSON.stringify(payload.order?.id)}`);
  saleorAPI.getOrder({
    version: mockedVersion,
    id: payload.order?.id ?? "",
  });

  saleorAPI.updateOrderMetadata({
    version: mockedVersion,
    id: payload.order?.id ?? "",
    input: [{ key: "webhook", value: "order-created" }],
  });

  return res.status(200).end();
});

export const config = {
  api: {
    bodyParser: false,
  },
};
