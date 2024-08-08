import { atom } from 'recoil';

export const isLoggedInStateAtom = atom({
  key: 'isLoggedInState',
  default: false,
});

export const usernameStateAtom = atom({
  key: 'username',
  default: '',
});