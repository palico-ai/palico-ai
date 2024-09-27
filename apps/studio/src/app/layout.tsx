import { ComponentWithChildren, ThemeProvider } from '@palico-ai/components';
import ReactQueryProvider from '../context/react_query';
import { Box } from '@mui/material';
import './global.css';

const AppRootLayout: React.FC<ComponentWithChildren> = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <ThemeProvider>
            <Box>{children}</Box>
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
};

export default AppRootLayout;
