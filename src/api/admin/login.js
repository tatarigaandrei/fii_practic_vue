import request from "../../request/request";

export function login(data) {
    return request({
        url:'/login_check',
        method:'post',
        data
    })
}
