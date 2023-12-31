import { useEffect, useState } from "react";
import ShopHeader from "../../components/ShopHeader";
import axiosClient from "../../axios-client";
import emailjs from "@emailjs/browser";
import { useNavigate } from "react-router-dom";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useTranslation } from "react-i18next";

const Checkout = () => {
    const navigate = useNavigate();
    const initialOptions = {
        clientId:
            "AcMqXNtjE44JT6QyytYDBaF-kzZHSCjwZLv2EfMbuavqDtxibI-q-Sm0J6nkCLw-Szx95PaA8mI1MQ5b",
        currency: "USD",
        intent: "capture",
    };
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState();
    const [count, setCount] = useState(0);
    const [subTotal, setSubTotal] = useState(0.00)
    const [total, setTotal] = useState(0.00);
    const [check, setCheck] = useState("");
    const [orderMethod, setOrderMethod] = useState({
        payment: null,
        shipping: null,
    });
    const [shipping, setShipping] = useState([]);
    const [payment, setPayment] = useState([]);
    const [shippingPrice, setShippingPrice] = useState(0);
    const [coupon, setCoupon] = useState(null);
    const [order, setOrder] = useState({
        products: products,
        total_price: total,
        device_id: window.localStorage.getItem("device"),
        address: "",
        full_name: "",
        email: "",
        phone: "",
        shipping_id: orderMethod.shipping,
        payment_id: orderMethod.shipping,
        status: "accepted",
    });

    const { t } = useTranslation('checkout')

    useEffect(() => {
        setTotal(subTotal + shippingPrice)
    }, [subTotal, shippingPrice])

    useEffect(() => {
        axiosClient
            .get(`/carts/${window.localStorage.getItem("device")}`)
            .then((res) => {
                setProducts(res.data.items);
                console.log(res.data.items);
                setCart(res.data.cart);
                let result = 0;
                res.data.items.forEach((item) => {
                    result += item.quantity;
                });
                setCount(result);
            });
        axiosClient.get("/payment").then(({ data }) => {
            setPayment(data);
        }).then;
        axiosClient.get("/shipping").then(({ data }) => setShipping(data));
    }, []);

    useEffect(() => {
        const data = products.reduce((acc, item) => {
            return acc + item.price * item.quantity;
        }, 0);
        setSubTotal(data);
    }, [products]);
    const createOrder = (data, actions) => {
        const val = document.getElementById("total-price").value;
        return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
                {
                    description: "Thanh toán giao dịch",
                    amount: {
                        currency_code: "USD",
                        value: parseFloat(val).toFixed(2) || 0.01,
                    },
                    items: products,
                },
            ],
        });
    };

    const onApprove = async (data, actions) => {
        const order = await actions.order.capture();
        console.log(order);

        handleOnApprove(order);
    };

    const handleOnApprove = (order) => {
        // tách Paypal sang component khác rồi fetch api lấy data tính lại các giá trị trong order.
        let shipping = 1;
        document.querySelectorAll(".shipping-checkbox").forEach((item) => {
            if (item.checked) {
                shipping = parseInt(item.getAttribute("id"));
            }
        });
        let productList = document.getElementsByName("product-list")[0].value;
        productList = JSON.parse(productList);
        axiosClient
            .post("/orders", {
                products: productList,
                total_price: document.getElementById("total-price").value,
                device_id: window.localStorage.getItem("device"),
                address: document.getElementsByName("address")[0].value,
                full_name: document.getElementsByName("fullname")[0].value,
                email: document.getElementsByName("email")[0].value,
                phone: document.getElementsByName("phone")[0].value,
                shipping_id: orderMethod.shipping,
                payment_id: 6,
                status: "accepted",
            })
            .then((res) => {
                const payload = {
                    uuid: order.id,
                    order_id: res.data,
                    intent: order.intent,
                    payer_id: order.payer.payer_id,
                    name: `${order.payer.name.given_name} ${order.payer.name.surname}`,
                    country_code: order.payer.address.country_code
                        ? order.payer.address.country_code
                        : "US",
                    email: order.payer.email_address,
                    purchase_units: JSON.stringify(order.purchase_units),
                    status: order.status,
                    created_at: order.create_time,
                    updated_at: order.update_time,
                };
                // console.log(payload);
                axiosClient
                    .post("/transaction", payload)
                    .then((res) => console.log(res.data))
                    .catch((err) => console.error(err));
            })
            .then((res) => {
                axiosClient
                    .post("/carts/clear", {
                        device: window.localStorage.getItem("device"),
                    })
                    .then((res) => {
                        console.log(res);
                        let templateParams = {
                            name: document.getElementsByName("fullname")[0].value,
                            email: document.getElementsByName("email")[0].value,
                            message: "Đây là email tự động không vui lòng reply :))",
                        };
                        emailjs
                            .send(
                                "service_090fxwg",
                                "template_rmutrmo",
                                templateParams,
                                "oZzkqsH6bTI3yU7ac"
                            )
                            .then(
                                function (response) {
                                    console.log("SUCCESS!", response.status, response.text);
                                    navigate(
                                        `/checkout/${window.localStorage.getItem(
                                            "device"
                                        )}/thank-you`
                                    );
                                },
                                function (error) {
                                    console.log("FAILED...", error);
                                }
                            );
                    });
            })
            .catch((err) => console.error(err));
    };

    const onError = (err) => {
        console.log(err);
    };

    const onCancel = () => { };

    const onValidate = () => { };

    const handleDiscount = (prevPrice) => {
        if(coupon){
            // if (coupon.status == 0) return prevPrice
            if (coupon.type === 'percent' && prevPrice >= coupon.min_amount) {
                console.log((coupon.discount_amount / 100) * prevPrice);
                setTotal((coupon.discount_amount / 100) * prevPrice)
            } else {
                return setTotal(prevPrice - coupon.discount_amount > 0 ? prevPrice - coupon.discount_amount : 0)
            }
        }
    };

    useEffect(() => {
        if (coupon && coupon.status == 1){
            if (coupon.type === 'percent' && total >= coupon.min_amount) {
                console.log((coupon.discount_amount / 100) * total);
                setTotal(total -(coupon.discount_amount / 100) * total)
            } else {
                setTotal(total - coupon.discount_amount > 0 ? total - coupon.discount_amount : 0)
            }
        }
    }, [coupon])

    return (
        <>
            <ShopHeader />
            <div
                className="row"
                style={{
                    justifyContent: "center",
                    width: "100%",
                    padding: "30px 0px",
                }}
            >
                <div
                    className="row"
                    style={{
                        width: "1140px",
                        marginTop: "50px",
                        justifyContent: "space-between",
                    }}
                >
                    <div
                        className="col-lg-6"
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                        }}
                    >
                        <div className="row">
                            <h2>{t('heading')}</h2>
                        </div>
                        <form
                            action=""
                            method="post"
                            className="row"
                            style={{ gap: "10px" }}
                        >
                            <input
                                name="fullname"
                                type="text"
                                placeholder={t('name')}
                                onChange={(e) => {
                                    setOrder({ ...order, full_name: e.target.value });
                                }}
                            />
                            <input
                                name="email"
                                type="text"
                                placeholder={t('email')}
                                onChange={(e) => {
                                    setOrder({ ...order, email: e.target.value });
                                }}
                            />
                            <input
                                name="phone"
                                type="text"
                                placeholder={t('phone')}
                                onChange={(e) => {
                                    setOrder({ ...order, phone: e.target.value });
                                }}
                            />
                            <input
                                name="address"
                                type="text"
                                placeholder={t('address')}
                                onChange={(e) => {
                                    setOrder({ ...order, address: e.target.value });
                                }}
                            />
                        </form>
                        <h5>{t('shipping')}</h5>
                        <form>
                            {shipping.map((s) => {
                                return (
                                    <div
                                        style={{
                                            display: "flex",
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            className="shipping-checkbox"
                                            id={s.id}
                                            style={{
                                                width: "30px",
                                            }}
                                            onClick={(e) => {
                                                document
                                                    .querySelectorAll(".shipping-checkbox")
                                                    .forEach((s) => {
                                                        if (s !== e.currentTarget) s.checked = false;
                                                    });
                                                setShippingPrice(s.price);
                                                setOrderMethod({ ...orderMethod, shipping: s.id });
                                            }}
                                        />
                                        <label
                                            htmlFor={s.id}
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                width: "70%",
                                            }}
                                        >
                                            <span>{s.name}</span>
                                            <span>{s.price}</span>
                                        </label>
                                    </div>
                                );
                            })}
                        </form>
                        <h5>{t('payment')}</h5>
                        <form>
                            {payment.map((p) => (
                                <div
                                    style={{
                                        display: "flex",
                                    }}
                                >
                                    {p.type === "cod" ||
                                        p.type === "Banking" ||
                                        p.type === "At Store" ? (
                                        <input
                                            type="checkbox"
                                            className="payment-checkbox"
                                            // id={p.id}
                                            style={{
                                                width: "20px",
                                            }}
                                            onClick={(e) => {
                                                document
                                                    .querySelectorAll(".payment-checkbox")
                                                    .forEach((st) => {
                                                        if (st !== e.currentTarget) st.checked = false;
                                                    });
                                                setOrderMethod({ ...orderMethod, payment: p.id });
                                            }}
                                        />
                                    ) : (
                                        ""
                                    )}
                                    {p.type === "cod" ? (
                                        <label
                                            htmlFor={p.id}
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                width: "70%",
                                            }}
                                        >
                                            <span>{p.type}</span>
                                            <span>{JSON.parse(p.detail)}</span>
                                        </label>
                                    ) : (
                                        ""
                                    )}
                                    {p.type === "Banking" ? (
                                        <label
                                            htmlFor={p.id}
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                width: "70%",
                                            }}
                                        >
                                            <span>{p.type}</span>
                                            <span>
                                                {JSON.parse(p.detail).bank_name +
                                                    ": " +
                                                    JSON.parse(p.detail).number}
                                            </span>
                                        </label>
                                    ) : (
                                        ""
                                    )}
                                    {p.type === "At Store" ? (
                                        <label
                                            htmlFor={p.id}
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                width: "70%",
                                            }}
                                        >
                                            <span>{p.type}</span>
                                            <span>
                                                {JSON.parse(p.detail).name +
                                                    ": " +
                                                    JSON.parse(p.detail).address}
                                            </span>
                                        </label>
                                    ) : (
                                        ""
                                    )}
                                </div>
                            ))}
                        </form>
                    </div>
                    <div className="col-lg-5">
                        <div className="row">{t('order.title')}: {count} {t('order.product')}</div>
                        <div className="row">
                            <input
                                type="hidden"
                                value={JSON.stringify(products)}
                                name="product-list"
                            />
                            {products &&
                                products.map((p, i) => {
                                    return (
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                padding: "10px 0",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <img
                                                src={p.images}
                                                style={{
                                                    width: "60px",
                                                    marginRight: "20px",
                                                }}
                                            />
                                            <div
                                                style={{
                                                    textAlign: "left",
                                                    width: "60%",
                                                }}
                                            >
                                                {p.name} (x{p.quantity})
                                            </div>
                                            <div
                                                style={{
                                                    width: "80px",
                                                    textAlign: "right",
                                                }}
                                            >
                                                {p.price}đ
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                width: "100%",
                                padding: "10px 0 10px 80px",
                                borderTop: "1px solid #ccc",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                }}
                            >
                                {t('order.subtotal')}:
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                }}
                            >
                                {subTotal}đ
                            </div>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "10px 0 10px 80px",
                                width: "100%",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                }}
                            >
                                {t('order.shipping_price')}:
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                }}
                            >
                                {shippingPrice}đ
                            </div>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "10px 0 10px 80px",
                                width: "100%",
                                alignItems: "center",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                }}
                            >
                                <input
                                    type="text"
                                    id="coupon"
                                    placeholder={t('order.coupon')}
                                />
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    backgroundColor: "#eee",
                                    height: "50px",
                                    width: "100px",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    cursor: "pointer",
                                }}
                                onClick={() => {
                                    axiosClient(
                                        "/coupons/check/" +
                                        document.getElementById("coupon").value
                                    ).then((res) => {
                                        setCoupon(res.data);
                                        console.log(res.data);
                                    });
                                }}
                            >
                                {t('order.apply')}
                            </div>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "10px 0 10px 80px",
                                width: "100%",
                                borderTop: "1px solid #ccc",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                }}
                            >
                                {t('order.total')}:
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                }}
                            >
                                {total}
                                đ
                                <input
                                    id="total-price"
                                    type="number"
                                    style={{
                                        display: "none",
                                    }}
                                    value={total}
                                />
                            </div>
                        </div>
                        <div
                            className="row"
                            style={{
                                display: "flex",
                                justifyContent: "end",
                            }}
                        >
                            <button
                                style={{
                                    width: "150px",
                                    padding: "5px 40px",
                                    margin: "10px 12px",
                                }}
                                onClick={() => {
                                    let productList =
                                        document.getElementsByName("product-list")[0].value;
                                    productList = JSON.parse(productList);
                                    const payload = {
                                        products: productList,
                                        total_price: document.getElementById("total-price").value,
                                        device_id: window.localStorage.getItem("device"),
                                        address: document.getElementsByName("address")[0].value,
                                        full_name: document.getElementsByName("fullname")[0].value,
                                        email: document.getElementsByName("email")[0].value,
                                        phone: document.getElementsByName("phone")[0].value,
                                        shipping_id: orderMethod.shipping,
                                        payment_id: orderMethod.payment,
                                        status: "accepted",
                                    };
                                    console.log(payload);
                                    axiosClient
                                        .post("orders/", payload, {
                                            headers: {
                                                Accept: "application/json",
                                            },
                                        })
                                        .then((res) => {
                                            console.log(res.data);
                                            axiosClient
                                                .post("/carts/clear", {
                                                    device: window.localStorage.getItem("device"),
                                                })
                                                .then((res) => {
                                                    console.log(res);
                                                    let templateParams = {
                                                        name: order.full_name,
                                                        email: order.email,
                                                        message: "test",
                                                    };
                                                    emailjs
                                                        .send(
                                                            "service_090fxwg",
                                                            "template_rmutrmo",
                                                            templateParams,
                                                            "oZzkqsH6bTI3yU7ac"
                                                        )
                                                        .then(
                                                            function (response) {
                                                                console.log(
                                                                    "SUCCESS!",
                                                                    response.status,
                                                                    response.text
                                                                );
                                                                navigate(
                                                                    `/checkout/${window.localStorage.getItem(
                                                                        "device"
                                                                    )}/thank-you`
                                                                );
                                                            },
                                                            function (error) {
                                                                console.log("FAILED...", error);
                                                            }
                                                        );
                                                });
                                        })
                                        .catch((err) => console.log(err));
                                }}
                            >
                                {t('order.submit')}
                            </button>
                        </div>
                        <div
                            className="row"
                            style={{
                                display: "flex",
                                justifyContent: "end",
                            }}
                        >
                            <div className="col-lg-1">{t('order.or')}</div>
                            <div className="col-lg-6">
                                <PayPalScriptProvider options={initialOptions}>
                                    <PayPalButtons
                                        style={{
                                            color: "silver",
                                            layout: "horizontal",
                                            height: 48,
                                            tagline: false,
                                            shape: "pill",
                                        }}
                                        createOrder={createOrder}
                                        onApprove={onApprove}
                                        onError={onError}
                                    />
                                </PayPalScriptProvider>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Checkout;
