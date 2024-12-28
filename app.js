
const e = React.createElement;

const App = () => {
    return e('div', null, 'Testing React');
};

console.log('React:', !!window.React); 
console.log('Root element:', !!document.getElementById('root')); 


ReactDOM.render(e(App), document.getElementById('root'));
