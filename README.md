# UAE Mapping Project

A comprehensive mapping and project management application for UAE cities including Abu Dhabi and Al Ain.

## Features

- Interactive maps with Mapbox integration
- 3D visualization with Cesium
- Document management system
- Project tracking and management
- Real-time data visualization
- Responsive design for all devices

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or pnpm package manager

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/Azizullah26/Vo-maping-.git
cd Vo-maping-
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
# or
pnpm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

Edit `.env.local` with your configuration values.

### Development

Run the development server:

\`\`\`bash
npm run dev
# or
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

\`\`\`bash
npm run build
npm start
\`\`\`

## Environment Variables

The application requires several environment variables for full functionality:

### Required for Database Features
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key

### Optional for Enhanced Features
- `MAPBOX_ACCESS_TOKEN` - For map functionality (server-side only)
- `BLOB_READ_WRITE_TOKEN` - For file storage

### Demo Mode
The application can run in demo mode without database configuration:
- `NEXT_PUBLIC_DEMO_MODE=true`
- `NEXT_PUBLIC_STATIC_MODE=true`

## Deployment

### Netlify

1. Connect your GitHub repository to Netlify
2. Set the build command to `npm run build`
3. Set the publish directory to `.next`
4. Add environment variables in Netlify dashboard
5. Deploy

### Vercel

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy

## Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── components/        # App-specific components
│   └── [pages]/          # Page components
├── components/            # Reusable UI components
├── lib/                  # Utility libraries
├── data/                 # Static data files
├── public/               # Static assets
└── styles/               # CSS modules and styles
\`\`\`

## Technologies Used

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Maps**: Mapbox GL JS
- **3D Visualization**: Cesium
- **Database**: Supabase
- **File Storage**: Vercel Blob
- **Deployment**: Netlify/Vercel

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is private and proprietary.
