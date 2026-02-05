// api/subscriber-count.js
const axios = require('axios');

export default async function handler(req, res) {
    // 1. 设置跨域头 (CORS)，允许你的前端域名访问
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    // 2. 设置边缘缓存：浏览器缓存 5 分钟，Vercel 全球节点缓存 1 小时
    // 这样 1 小时内只会真正请求 1 次 Klaviyo，完美解决频率限制问题
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');

    const KLAVIYO_API_KEY = process.env.KLAVIYO_API_KEY;
    const LIST_ID = process.env.KLAVIYO_LIST_ID;

    if (!KLAVIYO_API_KEY) {
        return res.status(500).json({ error: 'Configuration Error', details: 'KLAVIYO_API_KEY is missing from environment variables' });
    }
    if (!LIST_ID) {
        return res.status(500).json({ error: 'Configuration Error', details: 'KLAVIYO_LIST_ID is missing from environment variables' });
    }

    try {
        const response = await axios.get(`https://a.klaviyo.com/api/lists/${LIST_ID}/`, {
            params: { 'additional-fields[list]': 'profile_count' },
            headers: {
                'Authorization': `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
                'revision': '2024-02-15',
                'accept': 'application/vnd.api+json'
            }
        });

        const count = response.data.data.attributes.profile_count;
        res.status(200).json({ count });

    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ 
            error: 'Failed to fetch Klaviyo count',
            details: error.response?.data || error.message 
        });
    }
}