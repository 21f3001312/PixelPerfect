const express = require('express');
const { GoogleAuth } = require('google-auth-library');
const vision = require('@google-cloud/vision');
const cors = require('cors');

const app = express();
const port = 3000;

// Enable CORS for frontend communication
app.use(cors());
app.use(express.json());

// Initialize Vision API client with service account
const client = new vision.ImageAnnotatorClient({
  keyFilename: '../path/to/your/service-account-file.json', // Update with your service account file path
});

// Endpoint to analyze image
app.post('/analyze-image', async (req, res) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL required' });
    }
    const [result] = await client.labelDetection(imageUrl);
    const labels = result.labelAnnotations;
    const name = labels[0]?.description?.replace(/\s+/g, '-') || 'image';
    res.json({ name });
  } catch (error) {
    console.error('Vision API error:', error);
    res.status(500).json({ error: 'Failed to process image' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});