import { Box } from '@mui/material';
import Sidebar from '../../components/layout/sidebar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DashboardLayoutContextProvider from '../../context/dashboard_layout';

export const metadata = {
  title: 'Palico Studio',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayoutContextProvider>
      <Box
        sx={{
          display: 'flex',
          // backgroundColor: 'background.default',
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
  );
}
