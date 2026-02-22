const axios = require('axios');

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');

  const KLAVIYO_API_KEY = process.env.KLAVIYO_API_KEY;
  const KLAVIYO_METRIC_ID = process.env.KLAVIYO_METRIC_ID;

  const startTime = "2026-02-01T00:00:00Z";
  const endTime = "2026-03-06T23:59:59Z";

  try {
    const response = await axios.post(
      'https://a.klaviyo.com/api/metric-aggregates/',
      {
        data: {
          type: 'metric-aggregate',
          attributes: {
            measurements: ['count'],
            metric_id: KLAVIYO_METRIC_ID,
            filter: [
              `greater-or-equal(datetime,${startTime})`,
              `less-than(datetime,${endTime})`
            ],
            timezone: 'UTC'
          }
        }
      },
      {
        headers: {
          'Authorization': `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
          'revision': '2024-02-15',
          'accept': 'application/vnd.api+json'
        }
      }
    );

    console.log('Klaviyo API Response:', JSON.stringify(response.data, null, 2));

    const growthCount = response.data.data.attributes.data[0].measurements.count;
    
    res.status(200).json({ growth: growthCount });
  } catch (error) {
    console.error('Klaviyo API Error:', error.response?.data || error.message);
    res.status(500).json({ error: '无法获取数据', details: error.response?.data || error.message });
  }
}