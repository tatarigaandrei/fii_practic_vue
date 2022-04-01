import request from "../../request/request";

export function createAnswers(data) {
    return request({
        url:'/admin/answer/list',
        method:'post',
        data
    })
}

export function updateAnswer(answerId, data)
{
    return request({
        url:`/admin/answer/${answerId}`,
        method:'patch',
        data
    })
}


export function getAnswers(songId) {
    return request({
        url:`/admin/answer/song/${songId}`,
        method:'get',
    })
}
