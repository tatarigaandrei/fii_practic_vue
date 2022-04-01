import request from "../request/request";

export function getQuestions() {
    return request({
        url:'/',
        method:'get'
    })
}

export function checkQuestion(questionId, answerId) {
    return request({
        url:`/${questionId}/${answerId}/check`,
        method:'get'
    })
}