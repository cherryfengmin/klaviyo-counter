const axios = require('axios');

// 在这里填入你的私钥
const PRIVATE_KEY = 'pk_3ca00c3f03855f9e20153313fd631aed6c'; 

async function getAllMetrics() {
    try {
        const response = await axios.get('https://a.klaviyo.com/api/metrics/', {
            headers: {
                'Authorization': `Klaviyo-API-Key ${PRIVATE_KEY}`,
                'revision': '2024-02-15',
                'accept': 'application/vnd.api+json'
            }
        });

        console.log('--- 你的 Klaviyo 指标列表 ---');
        response.data.data.forEach(metric => {
            console.log(`名称: ${metric.attributes.name}`);
            console.log(`ID: ${metric.id}`);
            console.log('---------------------------');
        });
        
        console.log('\n提示：请在结果中寻找 "Subscribed to List"，复制它的 ID。');
    } catch (error) {
        console.error('获取失败，请检查 API Key 是否正确:', error.response?.data || error.message);
    }
}

getAllMetrics();
/*确保你安装了 Node.js。

在文件夹里打开终端，安装 axios：npm install axios。

运行脚本：node find-id.js。
*/