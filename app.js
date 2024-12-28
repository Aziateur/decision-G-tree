// Simple test to see if React is working
const e = React.createElement;

const App = () => {
    return e('div', null, 'Testing React');
};

console.log('React:', !!window.React);  // See if React is available
console.log('Root element:', !!document.getElementById('root')); // See if we can find root

// Initialize the app
ReactDOM.render(e(App), document.getElementById('root'));
