import ErrorBoundary from 'antd/lib/alert/ErrorBoundary';
import {message, Result} from 'antd';
import {hot} from 'react-hot-loader/root';
import {useMemo} from 'react';
import {MainRouter} from '../router/mainRouter';
import {urlConst} from '../common/constant/urlConst';
import {CMS_AUTHORITY_TYPE_MAP} from '../common/constant/variableConst';
import {store} from '../common/store/redux';
import {useHttp} from '../common/myHooks/useHttp';
import {UserInfoObj} from '../common/interfaces/common';
import {Menus} from '../common/components/pages/Menus/Menus';
import {Header} from '../common/components/pages/Header/Header';
import {Footer} from '../common/components/pages/Footer/Footer';
import {isProd} from '../common/helper/env';
import './App.less';

export const MainRouterTem = isProd() ? MainRouter : hot(MainRouter);

export default function App() {
    const [userInfo, , , loading] = useHttp<never, UserInfoObj>({
        url: urlConst.USER_INFO,
        methods: 'get',
        succCallBack: res => {
            store.dispatch({
                type: 'INIT_USER_INFO',
                data: res,
            });
        },
        errorCallBack: () => {
            message.error('获取用户信息出错！');
        },
    }, true);

    const hasPermission = useMemo<boolean>(() => {
        return userInfo?.roles?.some(item => Boolean(CMS_AUTHORITY_TYPE_MAP[item]));
    }, [userInfo]);

    return (
        <div className="app-container">
            <div className="left-menu">
                <div className="logo">
                    <a href="/">开发者中心后台管理系统</a>
                </div>
                <div className="menu-container">
                    <Menus />
                </div>
            </div>
            <div className="right-content">
                <div className="header-container">
                    <Header />
                </div>
                <div className="content-container">
                    {
                        loading ? '加载中...' : (
                            hasPermission ? (
                                <ErrorBoundary>
                                    <MainRouterTem isSub />
                                </ErrorBoundary>
                            ) : (
                                <Result
                                    status="warning"
                                    title="对不起，您还没有权限"
                                    extra="请联系管理员 韩戌 hanxu19@baidu.com"
                                />
                            )
                        )
                    }
                </div>
                <div className="footer-container">
                    <Footer />
                </div>
            </div>
        </div>
    );
}


