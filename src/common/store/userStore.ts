import {Injectable, Ioc} from '@baidu/ioc';
import {ReduxStoreAction, UserInfoObj} from '../interfaces/common';
import {UUserService} from '../services/user';

// 保存用户信息，系统操作的信息
const userInfo: UserInfoObj = {
    user: '',
    userEmail: '',
    roles: [],
    displayUser: '',
};


@Injectable()
class UserAction {
    constructor(
        private user: UUserService
    ) {}
    'INIT_USER_INFO' = (data: UserInfoObj) => {
        this.user.dispatch(data);
        return {
            ...data,
        };
    };
}

export function userInfoReducer(state: UserInfoObj = userInfo, action: ReduxStoreAction<UserAction, UserInfoObj>): UserInfoObj {
    let res = null;
    const userAction: UserAction = Ioc(UserAction);
    Object.keys(userAction).forEach(item => {
        if (action.type === item) {
            res = {
                ...state,
                ...userAction[item](action.data),
            };
        }
    });
    return res || state;
}
