require('dotenv').config();
const express = require('express');
const { S3Client, ListObjectsV2Command, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Get S3 config from environment
const getS3Config = () => ({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
  endpoint: process.env.AWS_ENDPOINT || undefined,
  forcePathStyle: true,
});

// Create S3 client
let s3Client = new S3Client(getS3Config());

// Middleware
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.get('/api/files', async (req, res) => {
  try {
    const bucket = req.query.bucket || process.env.S3_BUCKET || '';
    const prefix = req.query.prefix || process.env.S3_PREFIX || '';

    if (!bucket) {
      return res.json({ files: [], error: 'Bucket not specified' });
    }

    const command = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix,
    });

    const response = await s3Client.send(command);

    const files = (response.Contents || []).map(item => ({
      key: item.Key,
      name: item.Key.split('/').pop(),
      size: item.Size,
      lastModified: item.LastModified,
      type: getFileType(item.Key),
    })).filter(f => f.name).sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));

    res.json({ files, bucket });
  } catch (error) {
    console.error('Error listing files:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/file/:key(*)', async (req, res) => {
  try {
    const bucket = req.query.bucket || process.env.S3_BUCKET || '';

    if (!bucket) {
      return res.status(500).json({ error: 'Bucket not specified' });
    }

    const key = decodeURIComponent(req.params.key);
    const type = getFileType(key);

    // Generate signed URL directly
    const getCommand = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    const signedUrl = await getSignedUrl(s3Client, getCommand, { expiresIn: 86400 });

    res.json({
      key,
      name: key.split('/').pop(),
      type,
      url: signedUrl,
      bucket,
    });
  } catch (error) {
    console.error('Error getting file:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/config', (req, res) => {
  res.json({
    configured: !!(process.env.AWS_ACCESS_KEY_ID),
    endpoint: process.env.AWS_ENDPOINT || '',
    region: process.env.AWS_REGION || 'us-east-1',
  });
});

app.post('/api/save-env', express.json(), (req, res) => {
  const { bucket, endpoint, region, accessKey, secretKey, prefix } = req.body;

  const envContent = `# S3 Media Viewer Configuration
AWS_ACCESS_KEY_ID=${accessKey}
AWS_SECRET_ACCESS_KEY=${secretKey}
S3_BUCKET=${bucket}
S3_PREFIX=${prefix || ''}
AWS_ENDPOINT=${endpoint || ''}
AWS_REGION=${region || 'us-east-1'}
PORT=3000
`;

  fs.writeFile(path.join(__dirname, '.env'), envContent, (err) => {
    if (err) {
      console.error('Error saving .env:', err);
      return res.status(500).json({ error: 'Failed to save configuration' });
    }

    // Update environment variables and re-create S3 client
    process.env.AWS_ACCESS_KEY_ID = accessKey;
    process.env.AWS_SECRET_ACCESS_KEY = secretKey;
    process.env.S3_BUCKET = bucket;
    process.env.AWS_ENDPOINT = endpoint;
    process.env.AWS_REGION = region;
    process.env.S3_PREFIX = prefix || '';

    s3Client = new S3Client(getS3Config());

    res.json({ success: true });
  });
});

app.post('/api/set-bucket', express.json(), (req, res) => {
  const { bucket } = req.body;
  if (!bucket) {
    return res.status(400).json({ error: 'Bucket required' });
  }
  process.env.S3_BUCKET = bucket;
  res.json({ success: true, bucket });
});

function getFileType(key) {
  const ext = key.toLowerCase().split('.').pop() || '';
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'ico', 'avif'];
  const videoExts = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv', 'flv', 'wmv', 'm3u8'];
  const audioExts = ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a', 'wma', 'opus'];
  const docExts = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'json', 'xml', 'html', 'htm', 'md'];
  const model3dExts = ['glb', 'gltf', 'fbx', 'obj', 'dae', '3ds', 'ply'];

  if (imageExts.includes(ext)) return 'image';
  if (videoExts.includes(ext)) return 'video';
  if (audioExts.includes(ext)) return 'audio';
  if (docExts.includes(ext)) return 'document';
  if (model3dExts.includes(ext)) return 'model3d';
  return 'other';
}

app.listen(PORT, () => {
  console.log(`S3 Media Viewer running at http://localhost:${PORT}`);
});
