import { SaleorSyncWebhook } from "@saleor/app-sdk/handlers/next";
import { gql } from "urql";
import { TransactionRefundRequestedEventFragment } from "../../../../generated/graphql";
import { saleorApp } from "../../../saleor-app";

const TransactionRefundRequestedPayload = gql`
  fragment TransactionRefundRequestedEvent on TransactionRefundRequested {
    __typename
    action {
      amount
      actionType
    }
    transaction {
      id
      pspReference
    }
    grantedRefund {
      id
    }
  }
`;

const OrderCreatedGraphqlSubscription = gql`
  # Payload fragment must be included in the root query
  ${TransactionRefundRequestedPayload}
  subscription TransactionRefundRequested {
    event {
      ...TransactionRefundRequestedEvent
    }
  }
`;

export const transactionRefundRequestedWebhook =
  new SaleorSyncWebhook<TransactionRefundRequestedEventFragment>({
    name: "Transaction refunded in Saleor",
    webhookPath: "api/webhooks/transaction-refund-requested",
    event: "TRANSACTION_REFUND_REQUESTED",
    apl: saleorApp.apl,
    query: OrderCreatedGraphqlSubscription,
  });

export default transactionRefundRequestedWebhook.createHandler((req, res, ctx) => {
  const { payload } = ctx;

  console.log(`transactionRefundRequested: ${payload}`);

  return res.status(200).end();
});

export const config = {
  api: {
    bodyParser: false,
  },
};
