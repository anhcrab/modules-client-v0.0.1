import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider";
import axiosClient from "../../axios-client";
import TextEditor from "../../components/TextEditor";


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
            {product.id && <h1>Update Product: {product.name}</h1>}
            {!product.id && <h1>New Product</h1>}
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
                    <form onSubmit={onSubmit}>
                        <input
                            defaultValue={product.type}
                            onChange={e => setProduct({ ...product, type: e.target.value })}
                            placeholder="Type"
                        />
                        <input
                            defaultValue={product.name}
                            onChange={e => setProduct({ ...product, name: e.target.value })}
                            placeholder="Name"
                        />
                        <TextEditor
                            value={product}
                            setValue={setProduct}
                            height={250}
                            placeholder='Product summary'
                            type='summary'
                        />
                        <TextEditor
                            value={product}
                            setValue={setProduct}
                            height={500}
                            placeholder='Product details'
                            type='detail'
                        />
                        <input
                            defaultValue={product.regular_price}
                            onChange={e => setProduct({ ...product, regular_price: e.target.value })}
                            placeholder="Regular Price"
                        />
                        <input
                            defaultValue={product.sale_price}
                            onChange={e => setProduct({ ...product, sale_price: e.target.value })}
                            placeholder="Sale Price"
                        />
                        <input
                            defaultValue={product.stock_quantity}
                            onChange={e => setProduct({ ...product, stock_quantity: e.target.value })}
                            placeholder="Stocks"
                        />
                        <select name="prd-cat"
                            onChange={e => setProduct({ ...product, category: e.target.value })}
                        >
                            <option value={null}>Categories</option>
                            {cat && cat.map(cat => <option value={cat.id}>
                                {cat.name}
                            </option>)}
                        </select>
                        <br/>
                        <select name="prd-cat"
                            onChange={e => setProduct({ ...product, attribute_type: e.target.value })}
                        >
                            <option 
                                value={null} 
                                onChange={e => setProduct({
                                    ...product, 
                                    attribute_type: e.target.value
                                })}
                            >Attribute Types</option>
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
                            // defaultValue={product.attributes[0] && product.attributes[0].name}
                            onChange={e => setProduct({ 
                                ...product, 
                                attribute_name: e.target.value 
                            })}
                            placeholder="Attribute Name"
                        />
                        <input
                            // defaultValue={product.attributes[0] && product.attributes[0].name}
                            onChange={e => setProduct({ 
                                ...product, 
                                attribute_code: e.target.value 
                            })}
                            placeholder="Attribute Code"
                        />
                        <div style={{
                            width: '50%',
                        }}>
                            <img
                                src={product.images}
                                alt="Ảnh được hiển thị ở đây "
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
                        <button className="btn">Save</button>
                    </form>
                )}
            </div>
        </>
    )
}

export default NewProduct
