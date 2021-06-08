import React, {Suspense, useMemo} from 'react';
import {Switch, Route, RouteProps, Redirect} from 'react-router';
import _ from 'lodash';
import {Spin} from 'antd';

const Home = React.lazy(() => import('../modules/Home/Home'));
const App = React.lazy(() => import('../modules/App'));
const Test = React.lazy(() => import('../modules/Test/Test'));

interface RouterConfigObj extends RouteProps {
    subRouter?: RouterConfigObj[];
}
export const routerConfig: RouterConfigObj[] = [{
    path: '/bce-console-cms',
    render: () => <App />,
    subRouter: [
        {
            path: '/home',
            exact: true,
            render: () => <Home />,
        },
        {
            path: '/test',
            exact: true,
            render: () => <Test />,
        },
    ],
}, {
    path: '/login',
    exact: true,
    render: () => (
        <div>请登录</div>
    ),
}];


const routesLevelOne: RouteProps[] = [];
const routesLevelTwo: RouteProps[] = [];
routerConfig.forEach(item => {
    routesLevelOne.push(_.omit(item, 'subRouter'));
    if (item?.subRouter?.length > 0) {
        item.subRouter.forEach(sub => {
            routesLevelTwo.push({
                ...sub,
                path: `${item.path}${sub.path}`,
            });
        });
    }
});

export function MainRouter(props: {
    isSub: boolean;
}) {
    const routes = props.isSub ? routesLevelTwo : routesLevelOne;
    const routersRender = useMemo(() => {
        return routes.map(item => {
            return <Route key={Math.random().toString(36).substr(3)} {...item} />;
        });
    }, [routes]);
    return (
        <Suspense fallback={<Spin tip="Loading..." />}>
            <Switch>
                {routersRender as any}
                <Redirect exact path="/bce-console-cms" to={{pathname: '/bce-console-cms/home'}} />
                <Redirect exact path="/" to={{pathname: '/bce-console-cms/home'}} />
                <Route path="*" render={() => <div>404 未找到页面</div>} />
            </Switch>
        </Suspense>
    );
}
