import { Client } from "urql";
import {
  OrderByExternalRefDocument,
  OrderByIdDocument,
  UpdateOrderMetadataDocument,
} from "../../generated/graphql";
import { createClient } from "./create-graphq-client";

export class SaleorOrderAPIFactory {
  private client: Client;

  constructor(public apiUrl: string, public token: string) {
    this.client = createClient(apiUrl, async () => ({ token }));
  }

  private prepareQuery = (version: number | null, id: string, externalReference: string) => {
    if (version && version >= 3.15) {
      return this.client.query(OrderByIdDocument, { id });
    }
    return this.client.query(OrderByExternalRefDocument, { externalReference });
  };

  public async getOrder<T extends unknown>({
    version,
    id = "",
    externalReference = "",
  }: {
    version: number | null;
    id?: string;
    externalReference?: string;
  }) {
    return (await this.prepareQuery(version, id, externalReference).toPromise()) as T;
  }

  public updateMetadata = ({
    version,
    id,
    input,
  }: {
    version: number | null;
    id: string;
    input: { key: string; value: string }[];
  }) => {
    console.log("Version can be used to determine which mutation to use", version);
    return this.client.mutation(UpdateOrderMetadataDocument, { id, input }).toPromise();
  };
}
