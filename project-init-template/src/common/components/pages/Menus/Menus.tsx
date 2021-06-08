import {useState, useMemo} from 'react';
import {Menu} from 'antd';
import SubMenu from 'antd/lib/menu/SubMenu';
import {Link} from 'react-router-dom';
import {MenuMode} from 'antd/lib/menu';
import {Ioc} from '@baidu/ioc';
import {menusData, MenusDataObj} from '../../../config/menu';
import {UEventEmitter} from '../../../services/event';
import {useOnMount} from '../../../myHooks/lifeCycle';
import './index.less';

function getAllParentMenuKey(): string[] {
    return menusData.filter(item => item.children && item.children.length > 0).map(item => item.key);
}

const pathNameArr = window.location.pathname.split('/');

const menuItemNodeMap = new Map<string, {node: HTMLElement, item: MenusDataObj}>();

export function Menus(props: {
    menusData?: MenusDataObj[];
    mode?: MenuMode;
}) {
    const [event] = useState(() => Ioc(UEventEmitter));
    const [selectedKeys, setSelectedKeys] = useState(() => {
        return pathNameArr[pathNameArr.length - 1];
    });
    const menus = useMemo<MenusDataObj[]>(() => {
        return props.menusData || menusData;
    }, [props.menusData]);

    useOnMount(() => {
        event.on('munuChange', (e: MenusDataObj) => {
            document.title = e.title;
            setSelectedKeys(e.key);
        });
    });

    function clickMenuItemDom(item: MenusDataObj) {
        event.emit('munuChange', item);
    }

    const renderMenuItem = (childs: MenusDataObj[]) => {
        if (childs && childs.length > 0) {
            return childs.map(item => {
                return (
                    <Menu.Item
                        key={item.key}
                        onClick={() => clickMenuItemDom(item)}
                        hidden={item.hidden}
                        ref={(node: any) => {
                            if (node && node.node) {
                                menuItemNodeMap.set(item.route, {
                                    node: node.node,
                                    item,
                                });
                            }
                        }}
                    >
                        {
                            item.route ? (
                                <Link to={item.route}>
                                    {item.title}
                                </Link>
                            ) : item.title
                        }
                    </Menu.Item>
                );
            });
        } else {
            return null;
        }
    };
    return (
        <div className="menus">
            <Menu
                theme="dark"
                defaultOpenKeys={getAllParentMenuKey()}
                selectedKeys={[selectedKeys]}
                mode="inline"
            >
                {
                    menus.map(item => {
                        return (
                            item?.children?.length > 0
                                ? (
                                    <SubMenu
                                        key={item.key}
                                        title={item.title}
                                    >
                                        {renderMenuItem(item.children) }
                                    </SubMenu>
                                )
                                : renderMenuItem([item])
                        );
                    })
                }
            </Menu>
        </div>
    );
}
