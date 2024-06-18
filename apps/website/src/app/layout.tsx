import Footer from '../components/footer';
import Navbar from '../components/navbar';
import './global.css';
import { ThemeProvider } from '@palico-ai/components';
import { GoogleAnalytics } from '@next/third-parties/google';

export const metadata = {
  title: 'Palico AI',
  description: 'Experiment-Driven LLM Development',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <GoogleAnalytics gaId="G-Q39NFM4PTV" />
        <ThemeProvider>
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
