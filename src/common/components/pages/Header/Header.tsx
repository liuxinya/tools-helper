import './index.less';
import {Dropdown, Menu, Button} from 'antd';
import {UserOutlined} from '@ant-design/icons';
import {useSelector} from 'react-redux';
import {UserRole, UserInfoObj} from '../../../interfaces/common';

function UserMenu() {
    const userInfo = useSelector<any, UserInfoObj>(state => state.user);

    const greeting = () => {
        const hour = (new Date()).getHours();
        const warmYourHeart = ['夜深了', '充满活力的一天', '加油工作', '早点下班'];

        return warmYourHeart[Math.floor(hour / 6)] + '，';
    };

    const getUserRole = (roles: UserRole[]): string => {
        return roles.map(item => {
            return item;
        }).toString();
    };

    const overlay = (
        <Menu theme={'light'}>
            <Menu.Item key="name" disabled>账号：{userInfo.displayUser}</Menu.Item>
            <Menu.Item key="roles" disabled>角色：{getUserRole(userInfo.roles)}</Menu.Item>
            <Menu.Item key="logout"><a href="/logout">退出</a></Menu.Item>
        </Menu>
    );

    return (
        <Dropdown overlay={overlay}>
            <Button style={{border: 'none'}}>
                <UserOutlined style={{fontSize: 16}} />
                {greeting()}{userInfo.displayUser}
            </Button>
        </Dropdown>
    );
}

export function Header() {
    return (
        <div className="header">
            <div className="other"></div>
            <div className="user">
                <UserMenu />
            </div>
        </div>
    );
}
