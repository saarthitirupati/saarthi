const http = require('http');

async function updateStatus() {
  const fetchOptions = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/admin/status',
    method: 'GET'
  };

  const getStatus = new Promise((resolve, reject) => {
    const req = http.request(fetchOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.on('error', reject);
    req.end();
  });

  try {
    const currentStatus = await getStatus;
    
    currentStatus.ssdCounters = [
      { name: "Srinivasam Complex", description: "Opposite the Tirupati Central Bus Stand" },
      { name: "Vishnu Nivasam Complex", description: "Opposite the Tirupati Railway Station" },
      { name: "Bhudevi Complex", description: "Beside the Alipiri toll gate" }
    ];
    currentStatus.ssdTimingsGuide = "Tokens are issued between 2:00 PM and 4:00 PM. First-come, first-served; quotas frequently fill up quickly.";
    currentStatus.ssdNotice = "SSD token quota was completed due to heavy weekend crowds. Tokens for July 12th Darshan will be issued on July 11th, 2026. Issuance may begin anytime from 9 AM.";
    currentStatus.ssdTokenStatus = "closed-for-day";
    currentStatus.ssdNextTokenTime = "Tomorrow 9:00 AM";

    const postOptions = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/admin/status',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const postReq = http.request(postOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => console.log('Successfully updated:', data));
    });

    postReq.on('error', (e) => console.error('POST Error:', e));
    postReq.write(JSON.stringify(currentStatus));
    postReq.end();
    
  } catch (err) {
    console.error('Failed to get status:', err);
  }
}

updateStatus();
