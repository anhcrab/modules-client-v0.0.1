import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider";
import axiosClient from "../../axios-client";
import TextEditor from "../../components/TextEditor";
import { useTranslation } from "react-i18next";


const NewProduct = () => {
    let { id } = useParams();
    const navigate = useNavigate();
    const [cat, setCat] = useState([])
    // const [attr, setAttr] = useState([])
    const [product, setProduct] = useState({
        id: null,
        type: '',
        name: '',
        summary: '',
        detail: '',
        regular_price: '',
        sale_price: '',
        stock_quantity: '',
        category: '',
        attribute_type: '',
        attribute_name: '',
        attribute_code: '',
        images: null,
    })
    const [errors, setErrors] = useState(null)
    const [loading, setLoading] = useState(false)
    const { setNotification } = useStateContext()
    const { t } = useTranslation('admin')

    if (id) {
        useEffect(() => {
            setLoading(true)
            axiosClient.get(`/products/get/${id}`)
                .then(({ data }) => {
                    console.log(data.product);
                    setLoading(false)
                    setProduct(data.product)
                })
                .catch(() => {
                    setLoading(false)
                })
        }, [])
    }

    const onSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('id', product.id)
        formData.append('type', product.type)
        formData.append('name', product.name)
        formData.append('summary', product.summary)
        formData.append('detail', product.detail)
        formData.append('regular_price', product.regular_price)
        formData.append('sale_price', product.sale_price)
        formData.append('stock_quantity', product.stock_quantity)
        formData.append('category', product.category)
        formData.append('attribute_type', product.attribute_type)
        formData.append('attribute_name', product.attribute_name)
        formData.append('attribute_code', product.attribute_code)
        formData.append('images', product.images);

        if (product.id) {
            console.log(product);
            axiosClient.post(`/products/update/${product.id}`, formData, {
                headers: { 'Accept': 'multipart/form-data' }
            })
                .then((res) => {
                    console.log(res);
                    setNotification('Product was successfully updated')
                    navigate('/products')
                })
                .catch(err => {
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors)
                    }
                })
        } else {
            axiosClient.post('/products', formData, {
                headers: {
                    'Accept': 'multipart/form-data'
                }
            })
                .then((res) => {
                    console.log(res)
                    setNotification('Products was successfully created')
                    navigate('/products')
                })
                .catch(err => {
                    console.log(err)
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors)
                    }
                })
        }

    }

    useEffect(() => {
        axiosClient.get('/product-categories').then(res => setCat(res.data))
        // axiosClient.get('/product-attributes').then(res => setAttr(res.data))
    }, [])

    return (
        <>
            {product.id && <h1>{t('product.products.form.update')}: {product.name}</h1>}
            {!product.id && <h1>{t('product.products.form.new')}</h1>}
            <div className="card animated fadeInDown">
                {loading && (
                    <div className="text-center">
                        Loading...
                    </div>
                )}
                {errors &&
                    <div className="alert">
                        {Object.keys(errors).map(key => (
                            <p key={key}>{errors[key][0]}</p>
                        ))}
                    </div>
                }
                {!loading && (
                    <form onSubmit={onSubmit} style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        width: '1320px'
                    }}>
                        <input
                            defaultValue={product.type}
                            onChange={e => setProduct({ ...product, type: e.target.value })}
                            placeholder={t('product.products.form.type')}
                        />
                        <input
                            defaultValue={product.name}
                            onChange={e => setProduct({ ...product, name: e.target.value })}
                            placeholder={t('product.products.form.name')}
                        />
                        <TextEditor
                            value={product}
                            setValue={setProduct}
                            height={250}
                            placeholder={t('product.products.form.summary')}
                            type='summary'
                        />
                        <TextEditor
                            value={product}
                            setValue={setProduct}
                            height={500}
                            placeholder={t('product.products.form.detail')}
                            type='detail'
                        />
                        <input
                            defaultValue={product.regular_price}
                            onChange={e => setProduct({ ...product, regular_price: e.target.value })}
                            placeholder={t('product.products.form.regular_price')}
                        />
                        <input
                            defaultValue={product.sale_price}
                            onChange={e => setProduct({ ...product, sale_price: e.target.value })}
                            placeholder={t('product.products.form.sale_price')}
                        />
                        <input
                            defaultValue={product.quantity}
                            onChange={e => setProduct({ ...product, stock_quantity: e.target.value })}
                            placeholder={t('product.products.form.stocks')}
                        />
                        <select name="prd-cat"
                            onChange={e => setProduct({ ...product, category: e.target.value })}
                            style={{
                                width: '500px'
                            }}
                        >
                            <option value={null}>{t('product.products.form.categories')}</option>
                            {cat && cat.map(cat => <option value={cat.id}>
                                {cat.name}
                            </option>)}
                        </select>
                        <br/>
                        <select name="prd-cat"
                            onChange={e => setProduct({ ...product, attribute_type: e.target.value })}
                            style={{ width: '200px' }}
                        >
                            <option 
                                value={null} 
                                onChange={e => setProduct({
                                    ...product, 
                                    attribute_type: e.target.value
                                })}
                            >{t('product.products.form.attribute_type')}</option>
                            <option 
                                value="size"
                                onChange={e => setProduct({
                                    ...product, 
                                    attribute_type: e.target.value
                                })}
                            >Size</option>
                            <option 
                                value='color'
                                onChange={e => setProduct({
                                    ...product, 
                                    attribute_type: e.target.value
                                })}
                            >Color</option>
                        </select>
                        <input
                            // defaultValue={product.attributes && product.attributes.at(0).name}
                            onChange={e => setProduct({ 
                                ...product, 
                                attribute_name: e.target.value 
                            })}
                            placeholder={t('product.products.form.attribute_name')}
                        />
                        <input
                            // defaultValue={product.attributes && product.attributes.at(0).code}
                            onChange={e => setProduct({ 
                                ...product, 
                                attribute_code: e.target.value 
                            })}
                            placeholder={t('product.products.form.attribute_code')}
                        />
                        <div style={{
                            width: '50%',
                        }}>
                            <img
                                src={product.images}
                                alt={t('product.products.form.image_alt')}
                                style={{ width: '700px' }}
                            />
                        </div>
                        <input
                            type="file"
                            name="myImage"
                            onChange={(event) => {
                                console.log(event.target.files[0]);
                                setProduct({ ...product, images: event.target.files[0] });
                            }}
                        />
                        <button className="btn">{t('product.products.form.save')}</button>
                    </form>
                )}
            </div>
        </>
    )
}

export default NewProduct
