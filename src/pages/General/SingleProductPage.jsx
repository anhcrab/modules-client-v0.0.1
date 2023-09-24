import { useContext, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import axiosClient from "../../axios-client"
import ShopHeader from "../../components/ShopHeader"
import { StateContext } from "../../context/ContextProvider"
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '../../../firebase.config'
import { useTranslation } from "react-i18next"

const SingleProductPage = () => {
    const [headerCart, setHeaderCart] = useState(false)
    const { slug } = useParams()
    const [data, setData] = useState({})
    const [quantity, setQuantity] = useState(1)
    const { setHide } = useContext(StateContext)
    const [comments, setComments] = useState([])
    const [profile, setProfile] = useState()
    const [textarea, setTextarea] = useState('')
    const [user, setUser] = useState({})
    const { t } = useTranslation('single_product')
    useEffect(() => {
        axiosClient.get(`/products/${slug}`)
            .then(res => {
                setData(res.data)
            })
        axiosClient.get(`/reviews/${slug}`).then(res => {
            setComments(res.data)
        })
    }, [])

    const handleFacebookLogin = () => {
        signInWithPopup(auth, provider).then(res => {
            setProfile(res.user)
        })
    }
    return (
        <div className="row" style={{ justifyContent: 'center', width: '100%' }}>
            <ShopHeader cartState={headerCart} setCartState={setHeaderCart} />
            <div className="row" style={{ width: '1140px', paddingTop: '50px' }}>
                <div className="col-lg-6">
                    <img src={data.product && data.product.images} style={{
                        width: '400px',
                        height: '400px'
                    }} />
                </div>
                <div className="col-lg-6">
                    <h2>{data.product && data.product.name}</h2>
                    <p>{data.product && data.product.sale_price}đ</p>
                    <input
                        type="number"
                        min={1}
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        style={{
                            width: '300px',
                            marginRight: '200px'
                        }}
                    />
                    <button onClick={() => {
                        axiosClient.post('/carts/add', {
                            device: window.localStorage.getItem('device'),
                            product_id: data.product.id,
                            quantity: quantity
                        })
                            // .then(res => {
                            //     const newStock = data && parseInt(data.product.quantity) - parseInt(quantity)
                            //     const newTotal = data && parseInt(data.product.total_sale) + parseInt(quantity)
                            //     console.log({
                            //         stock: newStock,
                            //         total: newTotal
                            //     })
                            //     axiosClient.put('/products/update-stock/' + data.product.id, {
                            //         stock_quantity: newStock,
                            //         total_sale: newTotal
                            //     })
                            //         .then(res => console.log(res.data))
                            //         .catch(err => console.error(err))
                            // })
                        setHeaderCart(!headerCart)
                        setHide(false)
                    }}>{t('add_to_cart')}</button>
                    <h5>{t('summary')}</h5>
                    <div dangerouslySetInnerHTML={{
                        __html: data.product && data.product.summary
                    }}></div>
                    <span>
                        {data.product &&
                            `${t('keyword')}: ${data.product.name}, ${data.product.category}, ${data.product.attributes.map(a => a.name)}`}
                    </span>
                </div>
            </div>
            <div className="row" style={{ width: '1140px' }}>
                <h3 style={{
                    width: '100%',
                    borderBottom: '1px solid #ccc',
                    padding: '20px 0'
                }}>{t('detail')}</h3>
                <p
                    dangerouslySetInnerHTML={{
                        __html: data.product && data.product.detail
                    }}
                ></p>
                <div style={{
                    width: '100%',
                    padding: '0'
                }}>
                    <h3>{t('comment')}</h3>
                    <h4 style={{
                        width: '250px'
                    }}>
                        {!profile ? <button onClick={() => {
                            const client = signInWithPopup(auth, provider)
                            console.log(client);
                            setUser(client)
                        }}>
                            {t('fb_login')}
                        </button> : ''}
                    </h4>
                    <textarea
                        className="comment-box"
                        cols="140"
                        rows="10"
                        placeholder="leave a comment"
                        onChange={(e) => {
                            setTextarea(e.target.value)
                        }}
                    ></textarea>
                    <button onClick={() => {
                        let payload = {
                            device: window.localStorage.getItem('device'),
                            comment_content: textarea,
                            rating_star: 0,
                            product_id: data.product.id,
                        }
                        console.log(payload);
                        axiosClient.post(`/reviews/${slug}/new`, payload)
                            .then(res => {
                                document.querySelector('.comment-box').value = ''
                                window.location.reload()
                            })
                            .catch(err => console.log(err))
                    }}>{t('send')}</button>
                </div>
                {/* <div>{comments.length !== 0 ? comments.map(c => {
                    return (
                        <>
                            <h6>{c.username !== undefined ? c.username : 'Người dùng'}</h6>
                            <p>{c.content}</p>
                        </>
                    )

                }):''}</div> */}
            </div>
            {data.related_products && <div className="row" style={{
                justifyContent: 'center',
                textAlign: 'center',

            }}>
                <h3 style={{
                    width: '100%',
                    borderTop: '1px solid #ccc',
                    padding: '20px 0'
                }}>{t('related')}</h3>
                <div className="product-list-container" style={{
                    display: 'flex',
                    width: '80%'
                }}>
                    {data.related_products.map(p => {
                        return (
                            <Link className="product-item">
                                <img src={p.images} style={{
                                    width: '150px',
                                }} />
                                <h5>{p.name}</h5>
                                <p>{p.sale_price ? p.sale_price : p.regular_price}đ</p>
                            </Link>
                        )
                    })}
                </div>
            </div>}

            {data.non_related_products && <div className="row" style={{
                justifyContent: 'center',
                textAlign: 'center'
            }}>
                <h3 style={{
                    width: '100%',
                    padding: '20px 0'
                }}>{t('another')}</h3>
                <div className="product-list-container" style={{
                    display: 'flex',
                    gap: '12px',
                    width: '80%'
                }}>
                    {data.non_related_products && data.non_related_products.map(p => {
                        return (
                            <a
                                href={`../shop/${p.slug}`}
                                className="product-item"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    textDecoration: 'none',
                                    color: '#555'
                                }}
                            >
                                <img src={p.images} style={{
                                    width: '150px',
                                }} />
                                <div>
                                    <h5>{p.name}</h5>
                                    <p>{p.sale_price ? p.sale_price : p.regular_price}đ</p>
                                </div>
                            </a>
                        )
                    })}
                </div>
            </div>}
        </div>
    )
}

export default SingleProductPage
