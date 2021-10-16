import {atom} from 'recoil';

export const userToken = atom({
    key: 'userToken',
    default: null,
});

export const isLoggedIn = atom({
    key: 'isLoggedIn',
    default: false,
})