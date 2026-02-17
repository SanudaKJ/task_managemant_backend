"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAccessToken = setAccessToken;
exports.getAccessToken = getAccessToken;
let accessToken = null;
function setAccessToken(token) {
    accessToken = token;
}
function getAccessToken() {
    return accessToken;
}
