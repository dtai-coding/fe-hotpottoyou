import { Suspense } from 'react';
import { App as AntdApp } from 'antd';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import App from './app';

// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <HelmetProvider>
    <BrowserRouter>
      <Suspense>
        <AntdApp>
          <App />
        </AntdApp>
      </Suspense>
    </BrowserRouter>
  </HelmetProvider>
);
