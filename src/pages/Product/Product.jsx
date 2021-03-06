import React, { useState, useLayoutEffect } from 'react'
import Table from '../../components/table/Table'
import Swal from 'sweetalert2'
import BeatLoader from "react-spinners/BeatLoader";
import { useHistory } from 'react-router-dom'
import Api from '../../util/AxiosConfig'
const Product = () => {
    const history = useHistory();
    const [product, setProduct] = useState(null);
    const [images, setImages] = useState([])
    const getData = async () => {
        await setTimeout(() => {
             Api.get('product').then((res) => {
                setProduct(res.result)
            }).catch((err) => {
                console.log(err)
            })
        },1000)
        
    }
    const getImages = () => {
          Api.get(`image/`).then((res) => {
                setImages(res.result)
          }).catch((err) => {
              console.log(err)
          })
          
      }
      useLayoutEffect(() => {
        getImages()
        getData()
    }, [])

   

    const HandleEdit = id => {
        history.push({
            pathname: `/products/edit/${id}`
        })
    }
    const handleTrash = id => {
        Swal.fire({
            title: ' ایا مطمعن هستید میخواهید حذف کنید',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'var(--main-color)',
            cancelButtonColor: '#d33',
            confirmButtonText: 'حذف شود',
            cancelButtonText: 'خیر'
        }).then((result) => {
            if (result.isConfirmed) {
                
                Api.delete(`product/${id}`).then((res) => {
                    Swal.fire(
                        'حذف شد !',
                        'محصول مورد نظر با موفقیت پاک شد ',
                        'success',
                        'بستن'
                    )
                    setProduct( null)
                    getData()
                })
                    .catch((err) => {
                        console.log(err)
                    })
            }
        })
    }

    const customerTableHead = [
        'id',
        'عکس',
        'نام',
        ' نامک ',
        ' اکشن '
    ]
    const renderHead = (item, index) => <th key={index}>{item}</th>

    const renderBody = (item, index) => (
        <>
            <tr key={item.id} >
                <td>{index + 1}</td>
                {/* <td> <img src={images && item.images >= 1 ? '' :  images.filter(d => d._id === item.images[0])[0].url }  alt="عکس محصول" className="img-table" /> </td> */}
                <td>{item.name}</td>
               <td>{item.name}</td>
                <td>{item.slug}</td>
                <td>
                    <button className="panel_item_button" onClick={() => HandleEdit(item._id)} >
                        <i className='bx bx-edit panel_item_button_edit' ></i>
                    </button>
                    <button className="panel_item_button" onClick={() => handleTrash(item._id)} >
                        <i className='bx bx-trash panel_item_button_trash' ></i>
                    </button>
                </td>
            </tr>
        </>
    )

    return (
        <>
            <div  >
                <h2 className="page-header">
                    <div className="d-flex justify-between align-center">
                        <span className="animate">
                            محصولات
                        </span>
                        <button className="button" onClick={() => history.push('/products/add/')} >
                            افزودن محصول
                        </button>
                    </div>
                </h2>
                <div className="row">
                    <div className="col-12">
                        <div className="card animate-top">
                            <div className="card__body">
                                {
                                    product === null ? (
                                        <>
                                            <div className="d-flex justify-center align-center flex-col " >
                                                <BeatLoader color={'#a1a1a1'} size={20} />
                                                درحال بارگذاری
                                            </div>
                                        </>
                                    ) : product.length === 0 ? (
                                        <p> محصولی یافت نشد </p>
                                    ) : (
                                        <>
                                            <Table
                                                limit='5'
                                                headData={customerTableHead}
                                                renderHead={(item, index) => renderHead(item, index)}
                                                bodyData={product}
                                                renderBody={(item, index) => renderBody(item, index)}
                                            />
                                        </>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Product;