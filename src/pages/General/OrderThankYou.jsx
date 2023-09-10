import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axiosClient from "../../axios-client"

const OrderThankYou = () => {
    const { slug } = useParams()
    const [order, setOrder] = useState({})
    useEffect(() => {
        // axiosClient.get(`/orders/${slug}`).then(res => setOrder(res.data))
    }, [])
    return (
        <>
            <h1>Thank You</h1>
            <h5>Cảm ơn quý khách đã đặt hàng</h5>
            <a href="/shop">Tiếp tục mua hàng</a><br />
            <a href="/orders">Xem các đơn hàng đã đặt</a>
        </>
    )
}

export default OrderThankYou