const { BetaAnalyticsDataClient } = require('@google-analytics/data');

const propertyId = '487143549';

exports.handler = async function (event, context) {
  const { start_date, end_date } = JSON.parse(event.body || '{}');

  if (!start_date || !end_date) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing start_date or end_date' }),
    };
  }

  try {
    // Load service account credentials from environment variable
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);

    // Create client with credentials
    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials,
    });

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