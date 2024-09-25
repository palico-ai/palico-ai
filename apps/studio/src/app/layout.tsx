import { Box } from '@mui/material';
import Sidebar from '../components/layout/sidebar';
import { ThemeProvider } from '@palico-ai/components';
import './global.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DashboardLayoutContextProvider from '../context/dashboard_layout';
import ReactQueryProvider from '../context/react_query';

export const metadata = {
  title: 'Palico Studio',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <ThemeProvider>
            <DashboardLayoutContextProvider>
              <Box
                sx={{
                  display: 'flex',
                  backgroundColor: 'background.default',
                }}
              >
                <Sidebar />
                <ToastContainer position="bottom-left" />
                <Box
                  sx={{
                    width: '100%',
                    overflow: 'auto',
                  }}
                >
                  {children}
                </Box>
              </Box>
            </DashboardLayoutContextProvider>
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
