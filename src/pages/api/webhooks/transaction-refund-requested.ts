import { SaleorSyncWebhook } from "@saleor/app-sdk/handlers/next";
import {
  UntypedTransactionRefundRequested314Document,
  UntypedTransactionRefundRequestedDocument,
} from "../../../../generated/graphql";
import { saleorApp } from "../../../saleor-app";

export const transactionRefundRequestedWebhookFactory = (
  saleorVersion: string | undefined | string[]
) => {
  const commonConfig = {
    name: "Transaction refunded in Saleor",
    webhookPath: "api/webhooks/transaction-refund-requested",
    event: "TRANSACTION_REFUND_REQUESTED",
    apl: saleorApp.apl,
  } as const;

  if (saleorVersion && !Array.isArray(saleorVersion) && parseFloat(saleorVersion) >= 3.15) {
    return new SaleorSyncWebhook({
      ...commonConfig,
      query: UntypedTransactionRefundRequestedDocument,
    });
  }
  return new SaleorSyncWebhook({
    ...commonConfig,
    query: UntypedTransactionRefundRequested314Document,
  });
};

export default transactionRefundRequestedWebhookFactory(undefined).createHandler(
  (req, res, ctx) => {
    const { payload } = ctx;

    console.log(`transactionRefundRequested: ${payload}`);

    return res.status(200).end();
  }
);

export const config = {
  api: {
    bodyParser: false,
  },
};
