
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import { useState, useEffect, useLayoutEffect } from 'react'
import { useHistory, useParams } from 'react-router'

import GalleryModal from '../../components/Gallery/gallery';
import Swal from 'sweetalert2'
//Editor Required File
import 'froala-editor/css/froala_editor.pkgd.min.css'

import Api from '../../util/AxiosConfig'
const EditCategory = () => {
    const history = useHistory();
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [Image, setImage] = useState(null)
    const [Loading, setLoading] = useState(false)
    const { id } = useParams();
    const [CategoryList, setCategoryList] = useState(null)

    const [FormData, setFormData] = useState({
        detail: {
            categoryId : id,
            name: '',
            parentId: '',
            images : Image ? Image._id : '',
        }
    })
    
    const updateHandler = () => {
        // post Data in added category
        setLoading(true)
        if(FormData.detail.name === '') {
            setLoading(false)
            Swal.fire({
                icon: 'warning',
                title: '   نام دسته بندی نباید خالی باشد !!  ',
                
            })
        } else if (FormData.detail.images === '') {
            setLoading(false)

            Swal.fire({
                icon: 'warning',
                title: '  لطفا عکس دسته بندی را انتخاب کنید  ',
            })
        } else {
            Api.put(`category/`, FormData.detail).then(() => {
                setLoading(false)
                console.log(FormData.detail)
                Swal.fire({
                    icon: 'success',
                    title: '  دسته بندی شما اضافه شد  ',
                    confirmButtonText: 'تایید'
                })
                // history.push('/categories')
    
            })
                .catch((err) => {
                    setLoading(false)
    
                    // Swal.fire({
                    //     icon: 'error',
                    //     title: 'مشکلی پیش آمده است',
                    //     text: 'لطفا برسی کنید با سازنده سایت تماس برقرار کنید'
                    // })
                    if(err.response){
                        console.log(err.response)
                    }else {
                        console.log(err)
                    }
                })
        }
       
    }
    const changeHandler = (data) => {
        if (data.target.name === 'title') {
            setFormData((prev) => ({
                detail: {
                    categoryId: id ,
                    name: data.target.value,
                       parentId: prev.detail.parentId,
                    images: prev.detail.images
                }
            }))
        } else if (data.target.name === 'parent') {
            setFormData((prev) => ({
                detail: {
                    categoryId: id  ,
                    name: prev.detail.name,
                    parentId: data.target.value,
                    images: prev.detail.images
                }
            }))
        } 
    }
    const handlechanges = (e) => {
        setOpen(false)
        console.log(e)
        setImage(e)
        setFormData((prev) => (
            {
                detail: {
                    categoryId: id,
                    name: prev.detail.name,
                    parentId: prev.detail.parentId,
                    images: e._id,
                }
            }
        ))
        
    }
    const GetData = () => {
        Api.get('category').then((res) => {
            setCategoryList(res.result)
            res.result.filter(item => item._id === id).map(item => {    
                setFormData({
                    detail: {
                        categoryId: id ,
                        name: item.name,
                        parentId: item.parentId,
                        images: item.images.map(item => {
                            setImage(item)
                            return item._id
                        })
                    }
                })
                console.log(FormData.detail)
            })
        }).catch((err) => {
            console.log('getting data error see response : ')
            console.log(err)

        })
    }
    useLayoutEffect(() => {
        let connection = false;
        if(!connection){
            GetData()
        }
        return () => {
            connection = true
        }
    }, [])
    const style = {
        position:'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80vw',
        height: '70vh' ,
        backgroundColor: 'var(--main-bg)',
        borderRadius: '20px',
        padding: '20px'
    };
    return (
        <div>
            <h2 className="page-header top-sticky">
                <div className="d-flex justify-between align-center">
                    <span className="animate">
                        افزودن دسته بندی
                    </span>
                    <span className="d-flex " >
                        <button className={Loading ? " button bg-sucess disable" : "button bg-sucess"} onClick={updateHandler} >
                            ذخیره
                        </button>
                        <button className="button" onClick={() => history.go(-1)} >
                            بازگشت
                        </button>
                    </span>
                </div>
            </h2>
            <div className="row">
                <div className="col-12">
                    <div className="card animate-top">
                        <div className="card-title">
                            <label> نام دسته بندی </label>
                            <input type="text" className="form-control" name="title" value={FormData.detail.name} onChange={changeHandler} />
                            <br />
                            <br />
                            <label>  دسته بندی مادر </label>
                            <select className="form-control" name="parent" value={FormData.detail.parent_id} onChange={changeHandler} >
                                
                                {
                                    CategoryList === null ?(<option value=""> درحال پردازش ...  </option>) :
                                    CategoryList ? (
                                        <>
                                        <option value=""> بدون مادر </option>
                                        {
                                            
                                            CategoryList.map(item => {
                                                return (
                                                <>
                                                <option key={item._id} selected={item.parentId? item.parentId === FormData.detail.parentId ? 'selected' : '' : ''}  value={item._id}> {item.name} </option>
                                               </> 
                                                )
                                               
                                            })
                                        }
                                        </>
                                    ) : CategoryList.length === 0 &&(<option value=""> خالی  </option>) 
                                }
                            </select>

                            {/* <span className="d-flex justify-between">
                                <label> لینک محصول  :</label>
                                <a href={window.location.origin + '/' + state.detail.slug}>
                                    {window.location.origin + '/'} <span>{state.detail.slug}</span>
                                </a>
                            </span> */}
                        </div>
                        <div className="card-body">
                            <div className="d-flex justify-center">
                                <div>
                                    <span>
                                        <br />
                                        <label > عکس دسته بندی </label>
                                        <br />
                                    </span>
                                    <div className="upload_image">
                                        <div className="d-flex flex-col" >
                                            <button className="button " onClick={() => { handleOpen() }}>
                                                انتخاب عکس
                                            </button>
                                            <button className="button bg-danger" onClick={() => {
                                                 setImage(null)
                                                 setFormData(prev => ({
                                                    detail: {
                                                        name: prev.detail.name,
                                                        parentId: prev.detail.parentId,
                                                        images: '',
                                                    }
                                                 }))
                                                  }}>
                                                حذف عکس
                                            </button>
                                        </div>
                                        <img src={Image && Image.url} alt="" width="120" />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <Modal
                open={open}
                onClose={handleClose}

            >
                <div style={style}>
                    <GalleryModal data={handlechanges} />
                </div>
            </Modal>
        </div>
    )
}
export default EditCategory