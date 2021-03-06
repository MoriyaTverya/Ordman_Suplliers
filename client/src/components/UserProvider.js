import React, {createContext} from 'react';

export const UserContext = createContext({ 
    user:  window.sessionStorage.getItem('name'),
    auth: window.sessionStorage.getItem('auth'),
    id: window.sessionStorage.getItem('id'),
    innerAuth: window.sessionStorage.getItem('innerAuth')
});

export default function UserProvider (props) {
    const user =  window.sessionStorage.getItem('name');
    const auth = window.sessionStorage.getItem('auth');
    const id = window.sessionStorage.getItem('id');
    const innerAuth = window.sessionStorage.getItem('innerAuth');

    return (
      <UserContext.Provider value={{ user, auth, id, innerAuth}}>
        {props.children}
      </UserContext.Provider>
    );
  }