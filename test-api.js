// Test API endpoints
import http from 'http';

const testAPI = () => {
  const options = {
    hostname: 'localhost',
    port: 3002,
    path: '/api/control',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const data = JSON.stringify({
    device_id: 'indoor-01',
    control_type: 'fan',
    command: 'on'
  });

  const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers: ${JSON.stringify(res.headers)}`);
    
    res.on('data', (chunk) => {
      console.log(`Response: ${chunk}`);
    });
  });

  req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
  });

  req.write(data);
  req.end();
};

testAPI();
