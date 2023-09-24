import { RouterProvider } from "react-router-dom";
import router from "./router.jsx";
import { ContextProvider } from './context/ContextProvider.jsx'
import api from "./axios-client.js";
import { v4 as uuidv4 } from 'uuid'
import './i18n/i18n.js'

const App = () => {
    const currentDate = new Date(Date.now())
    if (!window.localStorage.getItem('device')) {
        const deviceId = uuidv4()
        window.localStorage.setItem('device', deviceId)
        const tmp = currentDate
        tmp.setMonth(currentDate.getMonth() + 1)
        window.localStorage.setItem('DEVICE_EXPIRY_DATE', tmp.toISOString())
        api.post('/carts', {
            device: deviceId
        })
    }

    if(new Date(window.localStorage.getItem('DEVICE_EXPIRY_DATE')) === currentDate){
        // TODO: Chưa test chức năng hoạt động của dòng này
        window.localStorage.removeItem('device')
        window.localStorage.removeItem('DEVICE_EXPIRY_DATE')
    }

    return (
        <ContextProvider>
            <RouterProvider router={router} />
        </ContextProvider>
    )
}

export default App