import { Client } from "urql";
import {
  OrderByExternalRefDocument,
  OrderByIdDocument,
  UpdateOrderMetadataDocument,
} from "../../generated/graphql";
import { createClient } from "./create-graphq-client";

export class SaleorAPIFactory {
  private client: Client;

  constructor(public apiUrl: string, public token: string) {
    this.client = createClient(apiUrl, async () => ({ token }));
  }

  public getOrder = ({
    version,
    id = "",
    externalReference = "",
  }: {
    version: number;
    id?: string;
    externalReference?: string;
  }) => {
    if (version >= 3.15) {
      return this.client.query(OrderByIdDocument, { id });
    }
    return this.client.query(OrderByExternalRefDocument, { externalReference });
  };

  public updateOrderMetadata = ({
    version,
    id,
    input,
  }: {
    version: number;
    id: string;
    input: { key: string; value: string }[];
  }) => {
    console.log("Version can be used to determine which mutation to use", version);
    return this.client.mutation(UpdateOrderMetadataDocument, { id, input });
  };
}
