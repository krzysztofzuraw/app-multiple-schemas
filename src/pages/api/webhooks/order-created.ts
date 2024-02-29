import { OrderByExternalRefQuery, OrderByIdQuery } from "../../../../generated/graphql";
import { createClient } from "../../../lib/create-graphq-client";
import { OrderCreatedWebhookFactory } from "../../../lib/order-created-webhook-factory";
import { OrderQueryFactory } from "../../../lib/query-factory";
import { SaleorOrderAPI } from "../../../lib/saleor-order-api";

export const orderCreatedWebhook = new OrderCreatedWebhookFactory();

export default orderCreatedWebhook.createHandler(async (req, res, ctx) => {
  const { payload, authData, schemaVersion } = ctx;

  const saleorAPI = new SaleorOrderAPI(authData.saleorApiUrl, authData.token);
  const client = createClient(authData.saleorApiUrl, async () => ({ token: authData.token }));

  console.log(`Schema version: ${schemaVersion}`);

  if (OrderCreatedWebhookFactory.isFullDataOrderCreated(schemaVersion, payload)) {
    console.log(`Full order: ${payload.order?.userEmail}`);
    const orderByExternalRef = await saleorAPI.getOrder<OrderByExternalRefQuery>({
      version: schemaVersion,
      externalReference: payload.order?.externalReference ?? "",
    });

    const query = OrderQueryFactory.resolveQuery(schemaVersion);

    const result = await client
      .query(query, {
        externalReference: payload.order?.externalReference ?? "",
      })
      .toPromise();

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
