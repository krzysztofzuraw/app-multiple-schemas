<div align="center">
<img width="150" alt="saleor-app-template" src="https://github.com/krzysztofzuraw/app-webhook-factory/blob/main/public/logo.png?raw=true">
</div>

<div align="center">
  <h1>Webhook Factory App</h1>
</div>

### Important places to look:

1. [`OrderCreatedWebhookFactory`](src/lib/order-created-webhook-factory.ts)
2. [Order created webhook](src/pages/api/webhooks/order-created.ts)
3. [Manifest](src/pages/api/manifest.ts)

### How to test if factory works

1. Install app for on both Saleor 3.14 and 3.15
2. Create order on Saleor 3.14 and 3.15 (e.g from Dashboard UI)
3. Webhook for 3.14 should have only `id` of an order
4. Webhook for 3.15 should have full order data
