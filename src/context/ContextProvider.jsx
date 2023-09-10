import {createContext, useContext, useState} from "react";

export const StateContext = createContext({
  currentUser: null,
  token: null,
  notification: null,
  setUser: () => {},
  setToken: () => {},
  setNotification: () => {}
})

export const ContextProvider = ({children}) => {
  const [user, setUser] = useState({});
  const [token, _setToken] = useState(window.localStorage.getItem('ACCESS_TOKEN'));
  const [notification, _setNotification] = useState('');
  const [headerCart, setHeaderCart] = useState(false)
  const [hide, setHide] = useState(true)

  const setToken = (token) => {
    _setToken(token)
    if (token) {
      window.localStorage.setItem('ACCESS_TOKEN', token);
    } else {
      window.localStorage.removeItem('ACCESS_TOKEN');
    }
  }

  const setNotification = message => {
    _setNotification(message);

    setTimeout(() => {
      _setNotification('')
    }, 5000)
  }

  return (
    <StateContext.Provider value={{
      user,
      setUser,
      token,
      setToken,
      notification,
      setNotification,
      headerCart,
      setHeaderCart,
      hide,
      setHide
    }}>
      {children}
    </StateContext.Provider>
  );
}

export const useStateContext = () => useContext(StateContext);
