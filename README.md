# GPT Analytics API (Netlify)

This project lets your MyGPT connect to Google Analytics (GA4) via Netlify serverless functions.

## 🔧 Setup Instructions

1. Place your `service-account.json` file in the root folder (same level as `netlify/`).
2. Deploy this project to Netlify.
3. Use the `openapi.yaml` file when configuring your GPT in the Actions tab.
4. Your endpoint will be:
   ```
   POST https://<your-netlify-site>.netlify.app/.netlify/functions/getTrafficSummary
   ```

## 🧪 Test Locally

You can use `netlify-cli` to test:

```bash
npm install
npm install -g netlify-cli
netlify dev
```

Then send a POST request to:
```
http://localhost:8888/.netlify/functions/getTrafficSummary
```

With JSON body:
```json
{
  "start_date": "2024-07-01",
  "end_date": "2024-07-07"
}
```
