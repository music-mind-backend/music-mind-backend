const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

const app = express();

// Enable CORS
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin
const serviceAccount = {
  type: "service_account",
  project_id: "music-mind-radio-website",
  private_key_id: "c4550ee09731faf8ca111433b57bfaea6b2913e5",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC/ZiIEOE4p1rAs\narMRJgLb4lIJj4sCIQStT7o5LKXHnX5fyMpq9j2gGLlyljgep29VNLdtphKLneol\nNihas3u/lxOpJ84a62TVocql2Xtc/0IMSLrVirXENSMtO+m5A3p52lcTBd3MtYey\npfpiSrkpxMjrXE/q4ZlSkZ5deiOuRyi03DmQb3EgMXQV1xt5dvbywdU2mO7OvFA4\nqZ0MtzeXfsYmqBGwqZiEAiVAndbyJLi2zDJSKvj/haMpkynGt2zUjMB938OWkhPb\n0vymVuDH66RBP1WbSKuHNMc6JnIUS7A3+N6XZiWAk/XSsK/sbp5txl1+Ct7F2kb7\nokFeYeHXAgMBAAECggEABpCdBdtdcE6a8QIvdJ0C0ol+oU38yWWS+ZrXPq91sKqJ\n7FoHwSQf8TfyjG8PuX5U8Zg72txlDqvIDzSwOzX56TD2YuW29Q6Hcv2/VnGfjtRB\nNginQpHPwD8AHxoR+6Z55KEvkyzoAMlmFZVfLDQh7YdkEbvsEHxGAz7l2VgRQCCo\nzRVhnqrPCncppszpyPc1tOBVVXMDrUIaE0AiDDxg108KXNXIWDvV/wXQFOASa3lF\n8UzQdJ610q+PRG5QL5ogvno8LbllUPTvsQBrIc1LtvfjHP92dcmp8v3Book2SmfY\nz2amRXTMjsGit/CUuYbLZVhErg6rOmCwdERqngU06QKBgQDwyyxH8/FYaomBFbaI\ngSLSBu+o1QMVhmnXZtIEO8C1/iJIwkQcpG0+ZuqKtdFRx39eB6ciIEAG95Cu7pC+\nDL3ejSTBdfST4PFlR2OTLBgyJrRBQDnQXqnqg7E3Vbj0Mhb2pnG6jexN+SPeB8z1\nwljb1L83N5ZOHZhCHe4G61X80wKBgQDLfGnGJwdZHJwhPeo48GUzc11Nxi6HRGY8\nvK/BA3QwK1MC9H0UdychcMS/P6FWQoiLbL1hUenBkoYF6LS7WqfV9RHtCrNNZ+d+\nt6an+Z7RX1kJY87NvXkJmPbOJ2WKIB5D2MesvLWuLSFyIEgVypPwxLjRwtQH+k1d\nBIcxmvBUbQKBgQCGvwtekHIkKiocZEwrAyi7I0qFzf3V08vy0AUCfXWP4lDJKnz3\nEkRXwTvKt4gVHXB27A1pGWb6/xql6bZxw6uUmKNS53EgN6aeKF7egrRfjC0evpQb\nuH2ZUGyhLIU9kbIsAGRwIu9zitG5c+AMPt9+1QTUH3Uq7YDArwL+OD98JQKBgBmc\nwk+PsAwWXsyMV4PtNj/AoJjefhLGmDvC4DhiL+i0O1Ge5nOB/+nkoM8Vuj/6ReeO\nu1OZlNupjrcFsGH4qjFzFFuKwkDW+Dtp8E8qS0Q9RR66clhRJgAAQeh26v/0xPpz\nOcbTRebzhUcxKwGbKv3eNQkqBbgvWDeCD2Y+A0wNAoGAW/i5sbZdjV/Ul/9/GpwE\nn1ypN3qeJr8meX7IP31PhiIhTH6UnNOHl4e5SiQXhBvUWM63xsSPsUttb0fEQ+Va\nVHYkYRNpXv1CKW0pQC4Sq1JG7DoWQM7PDVasm2wz/TceoqPd6nfuF/qV4RPgnH0f\nN/lDGvyot797oNxt2cdiCDs=\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-fbsvc@music-mind-radio-website.iam.gserviceaccount.com",
  client_id: "121768",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40music-mind-radio-website.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://music-mind-radio-website-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const db = admin.database();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Get DJ Overrides from Firebase
app.get('/api/dj-overrides', async (req, res) => {
  try {
    const snapshot = await db.ref('DJOverrides').get();
    const data = snapshot.val();
    res.json({ success: true, data: data || {} });
  } catch (error) {
    console.error('Error fetching DJ Overrides:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get Sponsors from Firebase
app.get('/api/sponsors', async (req, res) => {
  try {
    const snapshot = await db.ref('Sponsors').get();
    const data = snapshot.val();
    res.json({ success: true, data: data || {} });
  } catch (error) {
    console.error('Error fetching Sponsors:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get both DJ Overrides and Sponsors
app.get('/api/data', async (req, res) => {
  try {
    const djOverridesSnapshot = await db.ref('DJOverrides').get();
    const sponsorsSnapshot = await db.ref('Sponsors').get();
    
    res.json({
      success: true,
      djOverrides: djOverridesSnapshot.val() || {},
      sponsors: sponsorsSnapshot.val() || {}
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
