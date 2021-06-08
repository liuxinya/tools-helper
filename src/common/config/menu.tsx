export const menusData: MenusDataObj[] = [
    {
        title: 'test',
        route: '/bce-console-cms/test',
        key: 'Test777',
        icon: '',
    },
    {
        title: 'test123123123',
        route: '/login',
        key: 'Test22232',
        icon: '',
    },
    {
        title: 'test1',
        key: 'Test1',
        children: [
            {
                title: 'home',
                route: '/bce-console-cms/home',
                key: 'Test2',
            },
        ],
    },
];

export interface MenusDataObj {
    title: string;
    key: string;
    icon?: string;
    route?: string;
    children?: MenusDataObj[];
    [props: string]: any;
}
