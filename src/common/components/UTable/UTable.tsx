/**
 * @file 可调整顺序的表格
 */
import React, {useState, useImperativeHandle} from 'react';
import {Table} from 'antd';
import {TableProps as RcTableProps} from 'rc-table/lib/Table';
import {MenuOutlined} from '@ant-design/icons';
import {SortableContainer, SortableContainerProps, SortableElement, SortableElementProps, SortableHandle} from 'react-sortable-hoc';
import {TablePaginationConfig, TableProps} from 'antd/lib/table';
import {useStateRef} from '../../myHooks/useStateRef';
import {UTableProps, UTableApi} from '../../interfaces/page';
import {useOnMount, useOnUpdate} from '../../myHooks/lifeCycle';
import {changePositionByIndex} from '../../helper/array';
import {useHttp} from '../../myHooks/useHttp';
import {PageResponseObj, PageRequestObj} from '../../interfaces/common';
import './index.less';


type TrProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>;
type TbodyProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;

const SortableItem: React.ComponentClass<TrProps & SortableElementProps> = SortableElement((props: TrProps) => <tr {...props} />);

const SortableWrapper: React.ComponentClass<TbodyProps & SortableContainerProps> = SortableContainer((props: TbodyProps) => <tbody {...props} />);

const DragHandle = SortableHandle(() => (
    <MenuOutlined style={{cursor: 'pointer', color: '#999'}} />
));

type DataSource<R> = RcTableProps<R>['data'];

type OnChange<R> = TableProps<R>['onChange'];

// eslint-disable-next-line @typescript-eslint/ban-types
function TableTem<R extends object = {}, P extends object = {}>(props: UTableProps<R, P>, ref: UTableProps<R, P>['ref']) {
    const {
        columns,
        onSort,
        dataSource,
        rowKey = 'key',
        className,
        sortable = false,
        components,
        query = {
            url: '',
            params: {
                pageNo: 1,
                pageSize: 10,
            },
        },
    } = props;
    const [pagination, setPagination, paginationRef] = useStateRef<TablePaginationConfig>({
        defaultCurrent: 1,
        current: 1,
        pageSize: 10,
        showQuickJumper: true,
        total: 0,
    });
    const [list, setList] = useState<DataSource<R>>(dataSource);
    const [columnsState, setColumnsState] = useState(columns || []);
    const [listOrigin, , getList] = useHttp<P & Partial<PageRequestObj>, PageResponseObj<R>>({
        url: query.url,
        params: null,
        methods: 'get',
        defaultValue: {
            totalCount: 0,
            pageNo: 0,
            pageSize: 10,
            result: [],
        },
        succCallBack: res => {
            setPagination(data => ({
                ...data,
                current: res.pageNo,
                pageSize: res.pageSize,
                total: res.totalCount,
            }));
        },
    });

    useOnUpdate(() => {
        setList(dataSource);
    }, [dataSource]);

    useOnUpdate(() => {
        setPagination(pagination);
    }, [pagination]);

    useOnMount(() => {
        if (sortable) {
            const newColumns = [...columns];
            newColumns.unshift({
                title: 'Sort',
                dataIndex: 'sort',
                width: 30,
                className: 'drag-visible',
                render: () => <DragHandle />,
            });
            setColumnsState(newColumns);
        }
    });

    useImperativeHandle(ref, () => ({
        getListHttp: (paramsTem?: any) => {
            // 这里一定是新传入参数和旧的参数的组合
            const params = {
                ...(typeof query.params === 'function' ? query.params() : query.params),
                ...paramsTem,
            };
            return getList({
                pageNo: paginationRef.current.current,
                pageSize: paginationRef.current.pageSize,
                ...params,
            });
        },
        getListData: () => listOrigin,
    }));

    const onSortEnd: (info: {
        oldIndex: number;
        newIndex: number;
    }) => void = ({oldIndex, newIndex}) => {
        if (oldIndex !== newIndex) {
            const newData = changePositionByIndex<R>([...list], oldIndex, newIndex).filter(el => !!el);
            setList(newData);
            onSort && onSort(newData);
        }
    };

    const DraggableContainer = (props: React.ComponentClass<TbodyProps & SortableContainerProps>) => (
        <SortableWrapper
            useDragHandle
            helperClass="row-dragging"
            onSortEnd={onSortEnd}
            {...props}
        />
    );

    const DraggableBodyRow = ({...restProps}) => {
        const index = list.findIndex(x => x[rowKey as keyof R] === restProps['data-row-key']);
        return <SortableItem index={index} {...restProps} />;
    };

    const tableOnchangeHandler: OnChange<R> = (...e) => {
        if (query.url && e[0]) {
            getList({
                pageNo: e[0].current,
                pageSize: e[0].pageSize,
                ...(typeof query.params === 'function' ? query.params() : query.params),
            } as any);
        }
        props.onChange && props.onChange(e[0], e[1], e[2], e[3]);
    };

    return (
        <Table<R>
            {...props}
            className={sortable ? `u-sortable-table ${className}` : className}
            columns={columnsState}
            dataSource={list || listOrigin.result}
            pagination={props.pagination || pagination}
            components={sortable ? {
                body: {
                    wrapper: DraggableContainer,
                    row: DraggableBodyRow,
                },
            } : components}
            onChange={tableOnchangeHandler}
        />
    );
}


type UTableInterface= <R, P> (props: UTableProps<R, P>) => JSX.Element;
// eslint-disable-next-line @typescript-eslint/naming-convention
export const UTable: UTableInterface = React.forwardRef<UTableApi<any, any>, UTableProps['dataSource'][0]>(TableTem);
