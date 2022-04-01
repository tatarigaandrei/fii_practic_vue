import request from "../request/request";

export function getQuestions() {
    return request({
        url:'/game/songs',
        method:'get'
    })
}

export function checkQuestion(questionId, answerId) {
    return request({
        url:`game/verify/${questionId}/${answerId}`,
        method:'get'
    })
}