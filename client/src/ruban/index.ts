import '@babel/polyfill';
import create from 'legions';
import App from './containers/App';
/* import '../common/components/nprogress/index.css'; */
const app = create({enableDevTools:false,router: true,history:null});
app.start(App, '#react-lcm');

/* if (!global['_babelPolyfill']) {
    // 为了解决重复引入的问题
    require('babel-polyfill');
} */
// @ts-ignore
if (module.hot&&process.env.NODE_ENV==='dev') {
    // @ts-ignore
    module.hot.accept();
}
