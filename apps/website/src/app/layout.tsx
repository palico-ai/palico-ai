import Footer from '../components/footer';
import Navbar from '../components/navbar';
import './global.css';
import { ThemeProvider } from '@palico-ai/components';

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
        <ThemeProvider>
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
