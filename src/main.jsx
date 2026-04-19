import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { seedSampleData } from './data/sampleData';

seedSampleData();

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>);
