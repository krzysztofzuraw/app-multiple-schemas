import { OrderByExternalRefDocument, OrderByIdDocument } from "../../generated/graphql";

export class OrderQueryFactory {
  public static resolveQuery(version: number | null) {
    if (version && version >= 3.15) {
      return OrderByIdDocument;
    }
    return OrderByExternalRefDocument;
  }
}
