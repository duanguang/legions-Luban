const { createTransformer,createTransformerReactJsxProps } = require('ts-plugin-legions');
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
var packageConfig = require('./package.json');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const webpack = require('webpack');
const chalk = require('chalk');
const path = require('path');

module.exports = function (configs) {
    configs = Object.assign({}, configs, {
        name: packageConfig.name,
        defaultPort: 8002,
        projectType: 'ts',
        publicPath: '/app/',
        isTslint: true,
        //server:'172.16.15.50',
        devServer: Object.assign({},
            configs.devServer,
            {
                // proxy: {
                    // '/v1/oss/uploadByForm': {
                    //     target: 'https://qa-fc.hoolinks.com',
                    //     secure: false,
                    //     onProxyReq: (proxyReq, req, res) => {
                    //         proxyReq.setHeader('host', 'qa-fc.hoolinks.com');
                    //     },
                    // },
                // }
            }),
        apps: ['main','ruban'],
        entries: ['src/home/index'],
        webpack: {
            dllConfig: {
                vendors: [
                /* 'react',*/
                'mobx',
                'mobx-react', 
                'superagent',
                'react-router-dom',
                'react-dom',
                'classnames',
                'isomorphic-fetch',
                'history',
                'invariant',
                'warning',
                'hoist-non-react-statics',
                'sortablejs',
                'xlsx',
                "dexie",
                "html2canvas",
                "clipboard",
                "jsbarcode"]
            },
            commonsChunkPlugin: ['hoolinksDesign','common','vendor'],
            tsCompilePlugin: {
                option: {
                    getCustomTransformers:() => ({ before: [createTransformer(),createTransformerReactJsxProps({
                        components: [{ name: 'HLTable',props: 'uniqueUid',value: '' },
                        { name: 'HLFormContainer',props: 'uniqueUid' },
                        { name: 'QueryConditions',props: 'uniqueUid' }]
                    })] })
                },
            },
            disableReactHotLoader: false,
            cssModules: {
                enable: true, // 默认false
            },
            cssLoaders: {
                include: [path.join(process.cwd(), 'node_modules/hoolinks-legion-design')],
            },
            optimization: {
                splitChunks: {
                  cacheGroups: {
                    hoolinksDesign: {
                      chunks: "initial",
                      minChunks: 1,
                      name: "hoolinksDesign",
                      priority: 7,
                      test: /hoolinks-legion-design/,
                      //maxInitialRequests: 5, // The default limit is too small to showcase the effect
                      minSize: 0 // This is example is too small to create commons chunks
                    },
                  }
                },
            },
            plugins: [
                new ProgressBarPlugin({
                    summary: false,
                    format: `${chalk.green.bold('build [:bar]')}` + chalk.green.bold(':percent') + ' (:elapsed seconds)',
                    summaryContent: '',
                }),
                new webpack.NamedChunksPlugin(),
                new FilterWarningsPlugin({
                    exclude: /export .* was not found in/,
                }),
                // extractLESS
            ],
            extend: (loaders, { isDev, loaderType, projectType,transform }) => {
                /* if (loaderType === 'HotLoader' && isDev) {
                    loaders.push({
                        test: /\.(jsx|js)?$/,
                        loader: 'react-hot-loader!babel-loader',
                        include: [path.join(process.cwd(), 'node_modules/hoolinks-legion-design')],
                    });
                } */
                if (loaderType === 'JsLoader') {
                    loaders.push({
                        test: /\.(jsx|js)?$/,
                        include: [path.join(process.cwd(), 'node_modules/hoolinks-legion-design')],
                        loader: 'happypack/loader?id=js',
                    });
                }
                if (loaderType === 'TsLoader' && projectType === 'ts') {
                    loaders.push({
                        test: /\.(ts|tsx)$/,
                        include: [path.join(process.cwd(), 'node_modules/hoolinks-legion-design')],
                        loader: 'happypack/loader?id=ts',
                    });
                }
                // transform = {
                //     cssModule: CSS_MODULE_OPTION, // 内部css modules 默认值
                //     LoaderOptions: postcss_loader, // 内部默认加载器参数
                //     execution: generateLoaders // 内部通用生成loader use 值函数
                // }
                if (loaderType === 'StyleLoader' && transform) {
                    const newLoaders = [
                        {
                            test: /\.css$/,
                            use: transform.execution(null, null, null),
                            exclude: [path.join(process.cwd(), 'node_modules/hoolinks-legion-design')],
                            include: [path.join(process.cwd(), 'node_modules')]
                        },
                        {
                            test: new RegExp(`^(?!.*\\.modules).*\\.css`),
                            use: transform.execution(null, null, transform.LoaderOptions),
                            // use: ExtractTextPlugin.extract({
                            //     fallback: 'style-loader',
                            //     use: [{ loader: 'css-loader' ,options:{
                            //         importLoaders: 1,
                            //         }}]
                            // }),
                            include: [path.join(process.cwd(), 'node_modules/hoolinks-legion-design')],
                        },
                        {
                            test: new RegExp(`^(.*\\.modules).*\\.css`),
                            use: transform.execution(transform.cssModule, null, transform.LoaderOptions),
                            // use: ExtractTextPlugin.extract({
                            //     fallback: 'style-loader',
                            //     use: [{ loader: 'css-loader' ,options:{ modules: true,
                            //         importLoaders: 1,
                            //         localIdentName: `[local]-[hash:base64:6]`}},'resolve-url-loader',transform.LoaderOptions]
                            // }),
                            include: [path.join(process.cwd(), 'node_modules/hoolinks-legion-design')],
                        },
                        {
                            test: new RegExp(`^(?!.*\\.modules).*\\.less`),
                            use: transform.execution(null, { loader: 'less-loader', options: { javascriptEnabled: true } }),
                            // use: ExtractTextPlugin.extract({
                            //     fallback: 'style-loader',
                            //     use: [{ loader: 'css-loader' ,options:{
                            //         importLoaders: 1,
                            //         }},{ loader: 'less-loader', options: { javascriptEnabled: true } },transform.LoaderOptions]
                            // }),
                            include: [path.join(process.cwd(), 'node_modules/hoolinks-legion-design')],
                        },
                        {
                            /* test: /\.less/, */
                            test: new RegExp(`^(.*\\.modules).*\\.less`),
                            // use: ExtractTextPlugin.extract({
                            //     fallback: 'style-loader',
                            //     use: [{ loader: 'css-loader' ,options:{ modules: true,
                            //         importLoaders: 2,
                            //         localIdentName: `[local]-[hash:base64:6]`}},{ loader: 'less-loader', options: { javascriptEnabled: true } },transform.LoaderOptions]
                            // }),
                            use: transform.execution(transform.cssModule, { loader: 'less-loader', options: { javascriptEnabled: true } }),
                            include: [path.join(process.cwd(), 'node_modules/hoolinks-legion-design')],
                        },
                    ];
                    newLoaders.map((item) => {
                        loaders.push(item);
                    })
                    
                }
                
            },
            /* commonsChunkPlugin:['react','mobx-react','mobx','babel-polyfill','superagent',
                'react-router-dom','classnames','isomorphic-fetch',
                 'react-dom','history','invariant','warning','hoist-non-react-statics'], */
        },
        htmlWebpackPlugin: {
            title: "webApp"/*O2O订单管理系统*/,
        },
        "postcss": {
            "autoprefixer": {
                "browsers": ['last 2 version', 'safari 5', 'ios 6', 'android 4','ie >= 10']
            }
        },
        babel: {
            query: {
                presets: [
                    [
                    "@babel/preset-env",
                    {
                     /*  targets: {
                        esmodules: true,
                      }, */
                      "useBuiltIns": "entry", // entry usage
                        "corejs": "2",
                        "targets": {
                            "browsers": [ // 浏览器
                                "last 2 versions",
                                "ie >= 10"
                              ],
                          },
                    }
                  ],
                 /*  "@babel/preset-env", */
                "@babel/preset-react"],
                cacheDirectory: '.webpack_cache',
                plugins:  [
                    'add-module-exports',
        '@babel/plugin-transform-runtime',
        ["@babel/plugin-proposal-decorators", { "legacy": true }],
                    ['import', { libraryName: 'antd', style: true }],
                ]
            }
        }
    });
    return configs;
};


