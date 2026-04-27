import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Layout from './components/Layout';
import AnimatedRoutes from './components/AnimatedRoutes';
import ScrollToTop from './components/ScrollToTop';
import { useStore } from './store/useStore';

function App() {
  const fetchServices = useStore((state) => state.fetchServices);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <AnimatedRoutes />
      </Layout>
    </Router>
  );
}

export default App;
