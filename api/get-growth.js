export default async function handler(req, res) {
  // 设置你的私有 API Key 和 Metric ID (建议存为环境变量)

 const KLAVIYO_API_KEY = process.env.KLAVIYO_API_KEY;
 const METRIC_ID = process.env.KLAVIYO_METRIC_ID; // 从 Klaviyo Analytics > Metrics 获取
  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      revision: '2024-02-15',
      'content-type': 'application/json',
      'Authorization': `Klaviyo-API-Key ${KLAVIYO_API_KEY}`
    },
    body: JSON.stringify({
      data: {
        type: 'metric-aggregate',
        attributes: {
          measurements: ['count'],
          filter: [
            "greater-or-equal(datetime,2026-02-14T00:00:00)", // 开始时间
            "less-than(datetime,2026-02-25T00:00:00)",      // 结束时间
            `equals(metric_id,'${METRIC_ID}')`
          ],
          interval: 'month',
          timezone: 'UTC'
        }
      }
    })
  };

  try {
    const response = await fetch('https://a.klaviyo.com/api/metric-aggregates/', options);
    const data = await response.json();
    // 提取具体的增长数字
    const count = data.data.attributes.data[0].measurements.count;
    res.status(200).json({ growth: count });
  } catch (error) {
    res.status(500).json({ error: "无法获取数据" });
  }
}

// 如何获取klaviyo 指定时间区间email订阅者的增长数，把增长数输出到网页