import '../styles/globals.css';
import { Providers } from './providers';

export const metadata = {
  title: 'Majdoor - Connecting Workers with Employers',
  description: 'Find skilled workers or discover job opportunities in your area. Majdoor makes it easy to connect workers with employers.',
  keywords: 'jobs, workers, employment, labor, construction, cleaning, delivery, India',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}