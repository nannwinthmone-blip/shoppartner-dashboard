# ShopPartner Merchant Dashboard

ShopPartner is a polished front-end merchant operations dashboard demo for products, orders, customers, sales and commissions, payouts, promotions, analytics, and settings.

## Included

- Responsive light dashboard with dark navy sidebar and tactile emoji UI
- Dashboard metrics, sales overview, sales breakdown, quick actions, recent orders, top products, commission rules, notifications, support, and promotions
- Demo workflows for product CRUD, order creation, payout request, promotion creation, filtering, search, notifications, and mobile navigation
- Accessible labels, keyboard-focus styles, reduced-motion support, SEO metadata, Open Graph metadata, canonical URL, and WebApplication structured data
- Clearly labeled illustrative demo data; no real payment processing or financial claims

## Local development

```bash
pnpm install
pnpm dev
```

## Validation

```bash
pnpm check
pnpm build
```

## GitHub Pages

The repository includes `.github/workflows/deploy-pages.yml`. Pushes to `main` build the static site and deploy it through GitHub Pages. The workflow sets the Vite base path for the repository automatically.

If Pages is not enabled yet, open repository **Settings → Pages** and set the source to **GitHub Actions** once, then rerun the workflow.
