import request from "../../request/request";

export function getSongs() {
    return request({
        url:'/admin/song/all',
        method:'get'
    })
}

export function deleteSong(songId) {
    return request({
        url:`/admin/song/${songId}`,
        method:'delete'
    })
}


export function createSong(params) {
    return request({
        url:'/admin/song',
        method:'post',
        data: params
    })
}

export function getSong(songId) {
    return request({
        url:`/admin/song/${songId}`,
        method:'get',
    })
}


export function updateSong(songId, params) {
    return request({
        url:`/admin/song/${songId}`,
        method:'patch',
        data: params
    })
}
