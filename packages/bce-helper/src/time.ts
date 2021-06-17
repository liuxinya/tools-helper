import * as moment from 'moment';

export function utcToBJ(value: string, formatRule = 'YYYY.MM.DD HH:mm') {
    return moment(value).format(formatRule);
}
