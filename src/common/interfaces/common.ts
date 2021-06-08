/**
 * 项目公共接口，非组件
 */

// http message
export interface ResponseMsgObj {
    detail: any;
    code?: number;
    global: string;
}

export type NetMethods = 'get' | 'post' | 'put' | 'delete';

// http响应
export interface ResponseObj<T, K = null> {
    success: boolean;
    status: number;
    code?: string;
    message?: ResponseMsgObj;
    error?: K; // 错误数据
    result?: T; // 正常数据
    page?: PageResponseObj<T>; // 分页数据
    errcode?: number;
    errmsg?: string;
}


// http分页响应
export interface PageResponseObj<T> {
    order: string;
    orderBy: string;
    pageNo: number;
    pageSize: number;
    totalCount: number;
    result: T[];
}

/** 分页请求 */
export interface PageRequestObj {
    pageNo: number;
    pageSize: number;
}

// 用户角色
export enum UserRole {
    'QA' = 'QA',
    'DEVELOPER' = 'DEVELOPER',
}

export interface UserInfoObj {
    user: string;
    userEmail: string;
    roles: UserRole[];
    displayUser: string;
}

export interface MyReducerEvent<T> {
    getValue: () => T;
}

// redux action
export interface ReduxStoreAction<T, K = null> {
    type: keyof T;
    data?: K;
    [props: string]: any;
}
