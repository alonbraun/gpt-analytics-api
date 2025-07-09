const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const { GoogleAuth } = require('google-auth-library');
const path = require('path');
const fs = require('fs');

const propertyId = '353439430';

exports.handler = async function (event, context) {
  const { start_date, end_date } = JSON.parse(event.body || '{}');

  if (!start_date || !end_date) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing start_date or end_date' }),
    };
  }

  const auth = new GoogleAuth({
    keyFile: path.resolve(__dirname, '../../service-account.json'),
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
