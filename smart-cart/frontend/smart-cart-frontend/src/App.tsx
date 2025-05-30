import { BrowserRouter as Router } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Layout>
          {/* Routes will be added here */}
          <div>Welcome to Smart Shopping Cart</div>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
