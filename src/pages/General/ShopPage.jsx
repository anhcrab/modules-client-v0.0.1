import { useEffect, useState } from 'react'
import api from '../../axios-client.js'
import ShopHeader from '../../components/ShopHeader.jsx'
import { Link } from 'react-router-dom'

const ShopPage = () => {
    
    const [list, setList] = useState([])
    const [cat, setCat] = useState([])
    const [cartState, setCartState] = useState(true)
    const [filter, setFilter] = useState({
        price: '',
        size: '',
        color: '',
    })
    useEffect(() => {
        api.get('/products').then(res => {
            console.log(res);
            setList(res.data)
        })
        api.get('/product-categories').then(res => setCat(res.data))
    }, [])

    useEffect(() => {}, [cartState])

    const handleFilter = (e) => {
        api.get('/filter', filter).then(res => setList(res.data))
    }

    return (
        <>
            <ShopHeader />
            <main style={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
                paddingTop: '20px',
            }}>
                <div className="container row" style={{
                    display: 'flex',
                    width: '1200px',
                    justifyContent: 'center'
                }}>
                    <h2 className='row' style={{
                        textAlign: 'center',
                        width: '100%'
                    }}>SHOP PAGE</h2>
                    <div className="filter-list">
                        <select onChange={handleFilter}>
                            <option value="">giá</option>
                            <option value="">Dưới 100.000₫</option>
                            <option value="">100.000₫ - 250.000₫</option>
                            <option value="">250.000₫ - 500.000₫</option>
                            <option value="">500.000₫ - 800.000₫</option>
                            <option value="">Trên 800.000₫</option>
                        </select>
                    </div>
                    <div className="list-container row">
                        {list.map((item) => {
                            return (
                                <Link to={`/shop/${item.slug}`} className='col-lg-3' style={{
                                    alignItems: 'space-between',
                                }}>
                                    <img src={item.images} style={{
                                        width: '100%',
                                    }} />
                                    <h5>{item.name}</h5>
                                    <h6>price: {item.regular_price}đ</h6>
                                    <button>Xem</button>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </main>
        </>
    )
}

export default ShopPage