/* eslint-disable no-underscore-dangle */
/**
 * 用户信息服务
 * 用户信息存取操作以及其他衍生操作 统一至此
 * @file /common/model/userinfo.ts
 */

import {Injectable} from '@baidu/ioc';
import {UserRole, UserInfoObj} from '../interfaces/common';

type HandlerFn = (info: UserInfoObj) => void;
@Injectable()
export class UUserService {
    private _userInfo: UserInfoObj = {
        displayUser: '',
        user: '',
        roles: [],
        userEmail: '',
    };

    private handlers: HandlerFn[] = [];

    get userInfo() {
        return this._userInfo;
    }

    get isQA() {
        return this.rolesInclude([UserRole.QA]);
    }

    rolesInclude(roles: UserRole[], isAll = false): boolean {
        return roles[isAll ? 'every' : 'some'](item => (this._userInfo.roles.map(item => item) || []).includes(item));
    }

    subscribe(fn: HandlerFn) {
        this.handlers.push(fn);
    }

    dispatch(data: UserInfoObj) {
        this._userInfo = data;
        this.handlers.forEach(item => item(data));
    }
}
