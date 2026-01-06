# 🍞 TostUI S3 Media Viewer Standalone

A simple web-based media viewer for S3-compatible storage (MinIO, AWS S3, DigitalOcean Spaces, etc.).

![Screenshot 2026-01-03 031304](https://github.com/user-attachments/assets/eb283219-60d4-4f9c-86ce-8d2fa3afe6d2)

![Screenshot 2026-01-03 031819](https://github.com/user-attachments/assets/4e8d56ab-2cda-4b8c-ab73-dd4b3a90fbac)

## Features

- Browse and view files from S3-compatible storage (AWS S3, MinIO, DigitalOcean Spaces, etc.)
- Support for multiple file types: images, videos, audio, 3D models, and documents
- Filter files by type (All, Images, Videos, Audio, 3D)
- Search files by name
- Keyboard navigation (arrow keys for file navigation, filter switching, and image zoom)
- Image viewer with zoom (mouse wheel) and pan (drag) controls
- Video player with custom controls (play/pause, progress bar, volume control, mute)
- Audio player with custom controls (play/pause, skip forward/backward, progress bar)
- 3D model viewer using Google Model Viewer (with AR support for mobile devices)
- PLY point cloud/mesh viewer using Three.js (orbit controls, wireframe toggle, reset view)
- Document viewer (open text files in new tab, download other document types)
- Signed URLs with 24-hour expiration for secure temporary access
- Web-based configuration interface (settings modal for S3 credentials and options)
- Local storage persistence for configuration
- Responsive dark theme UI
- Loading states and error handling
- File metadata display (file size, last modified date)
- Bucket switching and prefix support for folder navigation

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
