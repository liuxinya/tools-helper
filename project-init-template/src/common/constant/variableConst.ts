import {UserRole} from '../interfaces/common';
/**
 * 放置业务常量
 */

export const TEST_1 = 1;


// cms侧和用户侧的host
export const HOST_DOMAIN_MAP = {
    CMS_ONLINE: 'http://cms.bce.baidu-int.com/',
    CMS_SANDBOX: 'http://cms.bcetest.baidu-int.com/',
};

export const CMS_AUTHORITY_TYPE_MAP: {
    [P in UserRole]: string;
} = {
    QA: '测试',
    DEVELOPER: '开发者',
};
