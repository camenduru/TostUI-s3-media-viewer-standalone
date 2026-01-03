# 🍞 TostUI S3 Media Viewer Standalone

A simple web-based media viewer for S3-compatible storage (MinIO, AWS S3, DigitalOcean Spaces, etc.).

![Screenshot 2026-01-03 031304](https://github.com/user-attachments/assets/eb283219-60d4-4f9c-86ce-8d2fa3afe6d2)

![Screenshot 2026-01-03 031819](https://github.com/user-attachments/assets/4e8d56ab-2cda-4b8c-ab73-dd4b3a90fbac)

## Features

- Browse files from S3 buckets
- View images, videos, and audio files
- View 3D models (glb, gltf, fbx, obj, dae, 3ds)
- View PLY point cloud/mesh files
- Filter files by type
- Search files by name
- Dark theme UI

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)

### Installation

```bash
pnpm install
```

### Configuration

Edit `.env` file with your S3 credentials:

```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
S3_BUCKET=your_bucket_name
S3_PREFIX=your/folder/path/
AWS_REGION=us-east-1
AWS_ENDPOINT=https://s3.amazonaws.com  # Optional, for S3-compatible services
```

### Development

```bash
pnpm dev
```

Open http://localhost:3000

### Production Build

```bash
pnpm build
```

## Supported File Types

- **Images**: jpg, jpeg, png, gif, bmp, webp, svg, ico, avif
- **Videos**: mp4, webm, ogg, mov, avi, mkv, flv, wmv, m3u8
- **Audio**: mp3, wav, ogg, flac, aac, m4a, wma, opus
- **3D Models**: glb, gltf, fbx, obj, dae, 3ds, ply

## License

MIT
