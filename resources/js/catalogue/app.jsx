import '../bootstrap';
import '../../css/catalogue.css';

import { createRoot } from 'react-dom/client';
import Main from './Main';

const rootElement = document.getElementById('catalogue-app');

if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<Main />);
}
