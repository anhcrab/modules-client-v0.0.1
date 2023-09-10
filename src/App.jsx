import { RouterProvider } from "react-router-dom";
import router from "./router.jsx";
import { ContextProvider } from './context/ContextProvider.jsx'
import api from "./axios-client.js";
import { v4 as uuidv4 } from 'uuid'
import { useEffect } from "react";

const App = () => {
    if (!window.localStorage.getItem('device')) {
        const deviceId = uuidv4()
        window.localStorage.setItem('device', deviceId)
        api.post('/carts', {
            device: deviceId
        })
    }

    setInterval(() => {
        localStorage.removeItem('device');
    }, 3600000);

    return (
        <ContextProvider>
            <RouterProvider router={router} />
        </ContextProvider>
    )
}

export default App