import {atom} from 'recoil';

export const userToken = atom({
    key: 'userToken',
    default: null,
});

/**
 * 0: 확인 필요
 * 1: 로그인
 * -1: 비로그인
 */
export const isLoggedIn = atom({
    key: 'isLoggedIn',
    default: 0,
})

export const userLon = atom({
    key: 'lon',
    default: 0
})

export const userLat = atom({
    key: 'lat',
    default: 0
})