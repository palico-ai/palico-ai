// Import the original mapper
import MDXComponents from '@theme-original/MDXComponents';
import { Grid } from '@mui/material';

export default {
  // Re-use the default mapping
  Grid,
  ...MDXComponents,
  // Map the "<Highlight>" tag to our Highlight component
  // `Highlight` will receive all props that were passed to `<Highlight>` in MDX
};