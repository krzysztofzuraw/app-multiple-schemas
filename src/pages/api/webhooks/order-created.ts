import { OrderByExternalRefQuery, OrderByIdQuery } from "../../../../generated/graphql";
import {
  OrderCreatedWebhookFactory,
  isFullOrder,
} from "../../../lib/order-created-webhook-factory";
import { SaleorOrderAPIFactory } from "../../../lib/saleor-order-api-factory";

export const orderCreatedWebhook = new OrderCreatedWebhookFactory();

export default orderCreatedWebhook.createHandler(async (req, res, ctx) => {
  const { payload, authData, schemaVersion } = ctx;

  const saleorAPI = new SaleorOrderAPIFactory(authData.saleorApiUrl, authData.token);

  if (isFullOrder(schemaVersion, payload)) {
    console.log(`Full order: ${payload.order?.userEmail}`);
    const orderByExternalRef = await saleorAPI.getOrder<OrderByExternalRefQuery>({
      version: schemaVersion,
      externalReference: payload.order?.externalReference ?? "",
    });
    console.log("BillingAddress", orderByExternalRef.order?.billingAddress);
  }

  console.log(`Id order only: ${JSON.stringify(payload.order?.id)}`);
  const orderById = await saleorAPI.getOrder<OrderByIdQuery>({
    version: schemaVersion,
    id: payload.order?.id ?? "",
  });
  console.log("ShippingAddress", orderById.order?.shippingAddress);

  saleorAPI.updateMetadata({
    version: schemaVersion,
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
