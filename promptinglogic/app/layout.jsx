// app/layout.jsx
// Purpose: Root Next.js App Router layout — wraps every page with Nav and Footer.
//   Defines global metadata, Inter font, and base dark-theme body styles.
// Key exports: metadata, default RootLayout

import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import './globals.css';

export const metadata = {
  metadataBase: new URL('https://promptinglogic.com'),
  title: {
    default: 'PromptingLogic — Finance Tools Built on Honest Math',
    template: '%s | PromptingLogic',
  },
  description:
    'Free finance tools built by a data scientist. FIRE retirement simulator, IRA calculator, and plain-English investing guides. No jargon. No Wall Street assumptions.',
  keywords: ['FIRE retirement', 'Monte Carlo simulation', 'safe withdrawal rate', 'Roth vs Traditional IRA', 'retirement calculator'],
  authors: [{ name: 'Ryan Ordonez' }],
  openGraph: {
    siteName: 'PromptingLogic',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@ryanordonez',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a0a] text-gray-100 antialiased">
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
