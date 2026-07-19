const { Client } = require('pg');

async function updateStatus() {
  const connectionString = 'postgresql://postgres:saarthi@2026@db.ehywzcxufqjywrnysmrz.supabase.co:5432/postgres';
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    console.log('Connected to DB');
    
    // First, get the current darshans
    const res = await client.query('SELECT darshans FROM tirumala_status WHERE id = 1');
    let darshans = res.rows[0].darshans || [];
    
    // Filter out old SSD_CONFIG
    let filteredDarshans = darshans.filter(d => d.name !== 'SSD_CONFIG');
    
    // Create new SSD_CONFIG
    const ssdConfig = {
      ssdTokenStatus: "closed-for-day",
      ssdNextTokenTime: "Tomorrow 9:00 AM",
      ssdNotice: "SSD token quota was completed due to heavy weekend crowds. Tokens for July 12th Darshan will be issued on July 11th, 2026. Issuance may begin anytime from 9 AM.",
      ssdTimingsGuide: "Tokens are issued between 2:00 PM and 4:00 PM. First-come, first-served; quotas frequently fill up quickly.",
      ssdCounters: [
        { name: "Srinivasam Complex", description: "Opposite the Tirupati Central Bus Stand" },
        { name: "Vishnu Nivasam Complex", description: "Opposite the Tirupati Railway Station" },
        { name: "Bhudevi Complex", description: "Beside the Alipiri toll gate" }
      ]
    };
    
    filteredDarshans.push({
      name: 'SSD_CONFIG',
      waitTime: JSON.stringify(ssdConfig),
      peakHours: ''
    });
    
    // Update DB
    await client.query('UPDATE tirumala_status SET darshans = $1, "lastUpdated" = $2 WHERE id = 1', [JSON.stringify(filteredDarshans), new Date().toISOString()]);
    
    console.log('Successfully updated DB');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

updateStatus();
