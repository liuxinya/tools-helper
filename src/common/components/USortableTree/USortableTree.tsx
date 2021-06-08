/**
 * @file: USortableTree
 * @author: liyunkun(liyunkun@baidu.com)
 */
import {useCallback} from 'react';
import {Button} from 'antd';
import SortableTree, {
    TreeItem,
    OnDragPreviousAndNextLocation,
    NodeData,
    ReactSortableTreeProps,
    NodeRenderer,
    removeNodeAtPath,
    // changeNodeAtPath,
    addNodeUnderParent,
    ExtendedNodeData,
} from 'react-sortable-tree';
import _ from 'lodash';
import 'react-sortable-tree/style.css';

import nodeContentRenderer from './NodeRenderer';

export type NodeProps = {
    options?: {addSubButton?: boolean, deleteButton?: boolean, addText?: string, deleteText?: string};
    [index: string]: any;
};

interface UReactSortableTreeProps extends ReactSortableTreeProps {
    setTreeData: (data: TreeItem[]) => void;
    generateNodeProps?: (data: ExtendedNodeData) => NodeProps;
    generateSubNode?: (data: TreeItem) => TreeItem;
}

// 自定义的属性，不能传递（或直接传递）给 SortableTree 的参数
const customedProps = ['setTreeData', 'generateNodeProps'];

// 克隆节点的数据结构，生成默认值，只有object, string, boolean三种类型
export const cloneNodeSchema = (node: TreeItem) => {
    const newNode: TreeItem = {};

    // 需要保留数据的属性
    const keepValueKeys: string[] = ['layer'];
    for (const key in node) {
        if (keepValueKeys.includes(key)) {
            newNode[key] = node[key];
        }
        else {
            const type = typeof node[key];
            newNode[key] = type === 'boolean' ? false : (type === 'object' ? cloneNodeSchema(node[key]) : '');
        }
    }

    return {
        ...newNode,
        expanded: false,
        children: [] as TreeItem[],
    };
};

// 是否能拖拽到某个位置：只有归属于同一个父级的节点间才能拖动位置
const handleDrop: (data: OnDragPreviousAndNextLocation & NodeData) => boolean = ({prevPath, nextPath}) => {
    const isSameDepth = prevPath.length === nextPath.length;
    const prev = prevPath.slice();
    const next = nextPath.slice();

    if (isSameDepth && prev.length >= 1) {
        prev.pop();
        next.pop();
    }

    return _.isEqual(prev, next);
};

export function USortableTree(props: UReactSortableTreeProps) {
    const {
        treeData,
        setTreeData,
        generateNodeProps: uGenerateNodeProps = () => ({} as NodeProps),
        generateSubNode,
    } = props;

    // 移除节点
    const removeNode = useCallback(path => {
        setTreeData((removeNodeAtPath({
            treeData,
            path,
            getNodeKey: ({treeIndex}) => treeIndex,
        })));
    }, [treeData, setTreeData]);

    // 新增子节点
    const addSubNode = useCallback((node, path) => {
        const defaultSubNode: TreeItem = node.children.length > 0
            ? cloneNodeSchema(node.children[0])
            : {
                title: '',
                layer: (node.layer || node.layer === 0) ? +node.layer + 1 : undefined,
                children: [],
            };

        const newNode = generateSubNode
            ? generateSubNode(node)
            : defaultSubNode;

        setTreeData(addNodeUnderParent({
            treeData,
            parentKey: path[path.length - 1],
            expandParent: true,
            getNodeKey: ({treeIndex}) => treeIndex,
            newNode,
        }).treeData);
    }, [treeData, setTreeData, generateSubNode]);

    // 生成节点渲染参数
    const generateNodeProps: (data: ExtendedNodeData) => ({[index: string]: any}) = useCallback(props => {
        const {node, path} = props;
        const getRemoveNode = (txt: string) => (<Button onClick={() => removeNode(path)}>{txt ? txt : '删除'}</Button>);
        const getAddNode = (txt: string) => (<Button type="primary" onClick={() => addSubNode(node, path)}>{txt ? txt : '新增子项'}</Button>);
        const nodeProps = uGenerateNodeProps(props);

        nodeProps.buttons = Array.isArray(nodeProps.buttons) ? nodeProps.buttons : [];
        if (nodeProps.options?.addSubButton) {
            const {addText} = nodeProps.options;
            nodeProps.buttons.push(getAddNode(addText));
        }
        if (nodeProps.options?.deleteButton) {
            const {deleteText} = nodeProps.options;
            nodeProps.buttons.push(getRemoveNode(deleteText));
        }

        return nodeProps;
    }, [removeNode, uGenerateNodeProps, addSubNode]);

    return (
        <SortableTree
            canDrop={handleDrop}
            nodeContentRenderer={nodeContentRenderer as NodeRenderer}
            generateNodeProps={generateNodeProps}
            isVirtualized={false}
            rowHeight={({node}) => {
                const height = Math.max(90 - 10 * node.layer, 55);
                return height;
            }}
            {...(_.omit(props, customedProps) as ReactSortableTreeProps)}
        />
    );
}
