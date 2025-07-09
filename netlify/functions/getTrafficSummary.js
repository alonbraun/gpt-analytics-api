const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const { GoogleAuth } = require('google-auth-library');

const propertyId = '353439430';

exports.handler = async function (event, context) {
  const { start_date, end_date } = JSON.parse(event.body || '{}');

  if (!start_date || !end_date) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing start_date or end_date' }),
    };
  }

  // ✅ Load service account credentials from environment variable
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);

  const auth = new GoogleAuth({
    credentials,
    scopes: 'https://www.googleapis.com/auth/analytics.readonly',
  });

  const analyticsDataClient = new BetaAnalyticsDataClient({ auth });

  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: start_date, endDate: end_date }],
      dimensions: [{ name: 'country' }],
      metrics: [{ name: 'activeUsers' }],
    });

    const results = response.rows.map((row) => ({
      country: row.dimensionValues[0].value,
      activeUsers: row.metricValues[0].value,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({ results }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};