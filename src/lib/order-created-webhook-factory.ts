import { NextWebhookApiHandler, SaleorAsyncWebhook } from "@saleor/app-sdk/handlers/next";
import {
  OrderCreated314Document,
  OrderCreatedDocument,
  OrderCreatedFullFragment,
  OrderIdFragment,
} from "../../generated/graphql";
import { saleorApp } from "../saleor-app";

type CombinedFragments = OrderCreatedFullFragment | OrderIdFragment;

export class OrderCreatedWebhookFactory {
  private webhook = new SaleorAsyncWebhook<CombinedFragments>({
    name: "Order Created in Saleor",
    webhookPath: "api/webhooks/order-created",
    event: "ORDER_CREATED",
    apl: saleorApp.apl,
    query: OrderCreatedDocument,
  });

  getWebhookManifest(apiBaseURL: string, saleorVersion: number) {
    if (saleorVersion >= 3.15) {
      this.webhook.query = OrderCreatedDocument;
      return this.webhook.getWebhookManifest(apiBaseURL);
    }

    this.webhook.query = OrderCreated314Document;
    return this.webhook.getWebhookManifest(apiBaseURL);
  }

  createHandler(handlerFn: NextWebhookApiHandler<CombinedFragments, {}>) {
    return this.webhook.createHandler(handlerFn);
  }
}
