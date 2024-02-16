import { createManifestHandler } from "@saleor/app-sdk/handlers/next";
import { AppManifest } from "@saleor/app-sdk/types";

import packageJson from "../../../package.json";
import { getSaleorVersion } from "../../lib/get-saleor-version";
import { orderCreatedWebhookFactory } from "./webhooks/order-created";

export default createManifestHandler({
  async manifestFactory({ appBaseUrl, request }) {
    const iframeBaseUrl = process.env.APP_IFRAME_BASE_URL ?? appBaseUrl;
    const apiBaseURL = process.env.APP_API_BASE_URL ?? appBaseUrl;

    // header is present in Saleor 3.15 and later
    const saleorVersion = getSaleorVersion(
      request.headers ? request.headers["saleor-schema-version"] : ""
    );
    console.log(`saleorVersion: ${saleorVersion}`);

    const manifest: AppManifest = {
      name: "App webhook factory",
      tokenTargetUrl: `${apiBaseURL}/api/register`,
      appUrl: iframeBaseUrl,
      permissions: ["MANAGE_ORDERS"],
      id: "saleor.app",
      version: packageJson.version,
      webhooks: [orderCreatedWebhookFactory.getWebhookManifest(apiBaseURL, saleorVersion)],
      extensions: [],
      author: "Saleor Commerce",
      brand: {
        logo: {
          default: `${apiBaseURL}/logo.png`,
        },
      },
    };

    return manifest;
  },
});
