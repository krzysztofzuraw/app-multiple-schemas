import { NextWebhookApiHandler, SaleorAsyncWebhook } from "@saleor/app-sdk/handlers/next";
import {
  OrderCreated314Document,
  OrderCreatedDocument,
  OrderCreatedFullFragment,
  OrderIdFragment,
} from "../../generated/graphql";
import { saleorApp } from "../saleor-app";

export class OrderCreatedWebhookFactory {
  commonConfig = {
    name: "Order Created in Saleor",
    webhookPath: "api/webhooks/order-created",
    event: "ORDER_CREATED",
    apl: saleorApp.apl,
  } as const;

  getWebhookManifest(apiBaseURL: string, saleorVersion: string | undefined | string[]) {
    if (saleorVersion && !Array.isArray(saleorVersion) && parseFloat(saleorVersion) >= 3.15) {
      return new SaleorAsyncWebhook<OrderCreatedFullFragment>({
        ...this.commonConfig,
        query: OrderCreatedDocument,
      }).getWebhookManifest(apiBaseURL);
    } else {
      return new SaleorAsyncWebhook<OrderIdFragment>({
        ...this.commonConfig,
        query: OrderCreated314Document,
      }).getWebhookManifest(apiBaseURL);
    }
  }

  createHandler(handlerFn: NextWebhookApiHandler<OrderCreatedFullFragment | OrderIdFragment, {}>) {
    return new SaleorAsyncWebhook<OrderCreatedFullFragment | OrderIdFragment>({
      ...this.commonConfig,
      query: OrderCreatedDocument,
    }).createHandler(handlerFn);
  }
}
