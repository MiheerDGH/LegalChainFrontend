import '@testing-library/jest-dom/extend-expect';

// Optional: mock window.scrollTo used by some components
Object.defineProperty(window, 'scrollTo', { value: () => {}, writable: true });
import '@testing-library/jest-dom/extend-expect';
