const axios = require('axios');

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');

    // --- 预设配置区 ---
    const START_DATE = '2026-02-14'; // 起始日期
    const END_DATE = '2026-02-25';   // 结束日期
    const KLAVIYO_API_KEY = process.env.KLAVIYO_API_KEY;
    const METRIC_ID = process.env.KLAVIYO_METRIC_ID;     // 填入你的 "Subscribed to List" Metric ID
    // ----------------

    try {
        const response = await axios.post(
            'https://a.klaviyo.com/api/metric-aggregates/',
            {
                data: {
                    type: 'metric-aggregate',
                    attributes: {
                        measurements: ['count'],
                        metric_id: METRIC_ID,
                        filter: [
                            `greater-or-equal(datetime,${START_DATE}T00:00:00Z)`,
                            `less-than(datetime,${END_DATE}T23:59:59Z)`
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
console.log(response.data);
        // 获取聚合后的数值
        const count = response.data.data.attributes.data[0].measurements.count;
        
        res.status(200).json({
            count: count,
            period: `${START_DATE} 至 ${END_DATE}`
        });
    } catch (error) {
        res.status(500).json({ error: '数据调取失败' });
    }
}