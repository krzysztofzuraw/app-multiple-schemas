import { SaleorAsyncWebhook } from "@saleor/app-sdk/handlers/next";
import {
  OrderCreated314Subscription,
  OrderCreatedSubscription,
  UntypedOrderCreated314Document,
  UntypedOrderCreatedDocument,
} from "../../../../generated/graphql";
import { saleorApp } from "../../../saleor-app";

type OrderCreatedPayload = Extract<OrderCreatedSubscription, { __typename: "OrderCreated" }>;
type OrderCreated314Payload = Extract<
  OrderCreated314Subscription,
  { __typename: "Order314Created" }
>;

export const orderCreatedWebhookFactory = (saleorVersion: string | undefined | string[]) => {
  const commonConfig = {
    name: "Order Created in Saleor",
    webhookPath: "api/webhooks/order-created",
    event: "ORDER_CREATED",
    apl: saleorApp.apl,
  } as const;

  if (saleorVersion && !Array.isArray(saleorVersion) && parseFloat(saleorVersion) >= 3.15) {
    return new SaleorAsyncWebhook<OrderCreatedPayload>({
      ...commonConfig,
      query: UntypedOrderCreatedDocument,
    });
  }
  return new SaleorAsyncWebhook<OrderCreated314Payload>({
    ...commonConfig,
    query: UntypedOrderCreated314Document,
  });
};

export default orderCreatedWebhookFactory(undefined).createHandler((req, res, ctx) => {
  const { payload } = ctx;

  console.log(`Order created: ${JSON.stringify(payload)}`);

  return res.status(200).end();
});

export const config = {
  api: {
    bodyParser: false,
  },
};
