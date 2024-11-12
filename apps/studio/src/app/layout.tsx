import { ComponentWithChildren, ThemeProvider } from '@palico-ai/components';
import ReactQueryProvider from '../context/react_query';
import './global.css';
import { WithHealthyAPI } from '../context/health_check';

const AppRootLayout: React.FC<ComponentWithChildren> = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <ThemeProvider>
            <WithHealthyAPI>{children}</WithHealthyAPI>
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
};

export default AppRootLayout;
