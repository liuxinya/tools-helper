import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {ConfigProvider} from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import {Router} from 'react-router';
import {createBrowserHistory} from 'history';
import moment from 'moment';
import {Ioc} from '@baidu/ioc';
import reportWebVitals from './reportWebVitals';
import {store} from './common/store/redux';
import {USetUp} from './common/setup/setup';
import 'moment/locale/zh-cn';
import {MainRouter} from './router/mainRouter';
import './index.less';

moment.locale('zh-cn');

Ioc(USetUp).init().then(() => {
    ReactDOM.render(
        <React.StrictMode>
            <Provider store={store}>
                <ConfigProvider locale={zhCN}>
                    {
                        <Router history={createBrowserHistory()}>
                            <MainRouter isSub={false} />
                        </Router>
                    }
                </ConfigProvider>
            </Provider>
        </React.StrictMode>,
        document.getElementById('root')
    );
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
