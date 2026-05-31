import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans, Comic_Neue } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import fs from 'fs'
import path from 'path'

// Automated server-side script to copy assets from absolute assets folder to public/images folder
try {
  const rootDir = process.cwd();
  const assetsDir = path.join(rootDir, 'assets');
  const publicDir = path.join(rootDir, 'public', 'images');
  
  if (fs.existsSync(assetsDir)) {
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // Copy prabhat_logo.png
    const logoSrc = path.join(assetsDir, 'prabhat_logo.png');
    const logoDest = path.join(publicDir, 'prabhat_logo.png');
    if (fs.existsSync(logoSrc)) {
      fs.copyFileSync(logoSrc, logoDest);
    }
    
    // Copy files from assets/fun
    const funSrcDir = path.join(assetsDir, 'fun');
    if (fs.existsSync(funSrcDir)) {
      const files = fs.readdirSync(funSrcDir);
      files.forEach(file => {
        fs.copyFileSync(path.join(funSrcDir, file), path.join(publicDir, file));
      });
    }
    
    // Copy other files from assets
    const filesInAssets = fs.readdirSync(assetsDir);
    filesInAssets.forEach(file => {
      const srcPath = path.join(assetsDir, file);
      // copy specific files if they are images
      if (fs.statSync(srcPath).isFile() && (file.endsWith('.jpeg') || file.endsWith('.jpg') || file.endsWith('.png'))) {
        fs.copyFileSync(srcPath, path.join(publicDir, file));
      }
    });
  }
} catch (err) {
  console.error("Asset copying failed:", err);
}


const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: '--font-plus-jakarta',
  display: 'swap'
});

const comicNeue = Comic_Neue({ 
  weight: ['400', '700'],
  subsets: ["latin"],
  variable: '--font-comic',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Prabhat Coaching Classes | Excellence in Education | Ghatkopar West, Mumbai',
  description: 'Prabhat Coaching Classes - The ultimate launchpad for Commerce & School Toppers in Ghatkopar. Personalized classroom mentorship for Class VIII to XII Commerce. 100% Board Exam Success Rate.',
  keywords: 'coaching classes, tuition, ghatkopar, mumbai, commerce, board exams, class 10, class 12, accounts, economics',
  icons: {
    icon: [
      {
        url: '/logo_icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/logo_icon.svg',
  },
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-white" suppressHydrationWarning>
      <body className={`${plusJakarta.variable} ${comicNeue.variable} font-sans antialiased`} suppressHydrationWarning>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
