
import { Sidebar } from "./Sidebar"
import { Link, useNavigate} from "react-router-dom"
import { FaSignOutAlt, FaArrowCircleRight, FaArrowAltCircleLeft } from "react-icons/fa"
import { useEffect, useState } from "react"
import { CourseForm1 } from "./CourseformComponents/CourseForm1"
import { CourseForm2 } from "./CourseformComponents/CourseForm2"
import { CourseFormProps, course1Errors, course2Errors } from "../../types"
import { toast } from "react-toastify"
import { useAddCourseMutation } from "../../utils/redux/slices/instructorApiSlices"
import { useSelector } from "react-redux"
import CircularProgress from '@mui/material/CircularProgress';



export function AddCourse() {

const [addCourse] = useAddCourseMutation()
const [step, setStep] = useState(1)
const [loading,setLoading] = useState(false)
const [instructorId,setId] = useState('')
const navigate = useNavigate()
const instructor = useSelector((state: any) => state.instructorAuth.instructorInfo)
var validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const validVideoTypes = ['video/mp4','video/webm','video/ogg','video/quicktime','video/x-msvideo','video/x-matroska','video/x-ms-wmv']

const [formData, setFromData] = useState<CourseFormProps['formData']>({
  name: '',
  description: '',
  category: '',
  price: '',
  courselevel: '',
  courseImage: null,
  Introvideo:null,
  module: [],
  InstructorId:instructorId
})

useEffect(()=>{
    const instructorData = localStorage.getItem('instructorInfo')
    if(instructorData){
           const details = JSON.parse(instructorData)
           if(details){
           setId(details._id)
           }
    }
},[])

const backward = () => {
  setStep(step - 1)
}

  const [form1Errors, setForm1ValidationErrors] = useState<course1Errors>({
    name: '',
    description: '',
    category: '',
    price: '',
    courselevel: '',
    courseImage: null,
    Introvideo:null
  })
  const hasErrors = Object.values(form1Errors).some((error) => error !== '')
  const forward = (e:any) => {
    e.preventDefault()
  if(hasErrors){
        toast.error('Enter the details to continue')
  }else{
  setStep(step + 1)
  }
  }
 

 
  const [form2Errors, setForm2ValidationErrors] = useState<course2Errors>({
    title: '',
    video: '',
    duration: '',
    description:''
  })
  const handleImageUpload=async(imageData:any)=>{
    const upload = await fetch(`https://api.cloudinary.com/v1_1/dzhdkfjsw/image/upload`,{
      method:'POST',
      body:imageData
    })
    return await upload.json()
  }

  const handleChange = async(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    
    const { name, value } = e.target
    
    if (e.target instanceof HTMLInputElement && e.target.files) {
      
      toast.info('updating details')

      const file = e.target.files[0]
      const filetype = file.type
      let url
      if(validImageTypes.includes(filetype)){
        const imageData = new FormData()
        imageData.append('file',file)
        imageData.append('upload_preset','vedaByte')
        
        const res = await handleImageUpload(imageData)
         url = res.url
        
      if(res && res.url){
        setLoading(false)
  
        }else{
  
          toast.error('Image not uploaded ! try again')
          return
        }
      }else{
        
        if(validVideoTypes.includes(filetype)){
          setLoading(true)
          const videoData = new FormData()
          videoData.append('file',file)
          videoData.append('upload_preset','vedaByte')
          const res = await fetch(`https://api.cloudinary.com/v1_1/dzhdkfjsw/video/upload`, {
            method: 'POST',
            body: videoData
        })      

         const result=await res.json()  
          url = result.url
          if(result && result.url){
            setLoading(false)
          }
        }
      }
      setLoading(false)
     
      setFromData({
        ...formData,
        [name]: url
      })

    } else {
      setFromData({
        ...formData,
        [name]: value
      })
    } 
  }

const handleModule=(data:{title:string,description:string,videoURL:string ,duration:string})=>{
  const updatedModule = [...formData.module,data]

        setFromData({
        ...formData,
        module:updatedModule   
      })
}

const handleSubmit= async(e:any)=>{
    e.preventDefault()
    formData.InstructorId = instructorId
    const moduels = formData.module.length
    if(moduels<1){
      toast.error('Add sections to submit course')
      return
    }
   
    try {
      const res = await addCourse(formData).unwrap()
      if(res.status === true){
        toast.success('Course created successfully')
      }
      navigate('/instructor/courses')

    } catch (error:any){
      toast.error(error.message)
    }
}
 
  return (
    <div className="main-layout">

      <Sidebar />

      <div className="content h-screen ">
        <div className="w-screen/2  h-14 rounded-lg shadow-lg justify-between items-center p-3 flex ">
          <h1 className="ml-3 text-lg  text-black font-bold text-1xl">Add course</h1>
          <div className=" flex justify-center items-center">
            <img src={instructor?.profileImage} className="justify-end border-8 border-blue-900 w-8  mr-5 rounded-full h-8 " alt="" />
            <Link to="/logout" className="flex">
              <FaSignOutAlt />logout
            </Link>
          </div>
        </div>

        <div className="overflow-x-hidden p-10 mt-5 bg-white shadow-xl rounded-lg  ">

          <div>
          <form onSubmit={handleSubmit} >
            {step === 1 &&
              <div>
                <CourseForm1 formData={formData} handleChange={handleChange} handleModule={handleModule} validationErrors={form1Errors} setValidationErrors={setForm1ValidationErrors}/>
                
                <div className="flex justify-between p-3">
                  {step > 1 ? <button onClick={backward} className="bg-sky-600 text-white w-24 h-8 rounded-full">
                    Back <FaArrowAltCircleLeft />
                  </button> : ''
                  }
                  {hasErrors ? '':    <button onClick={forward} className={`bg-blue-600 text-white w-24 h-8  rounded-full flex justify-center items-center gap-2 fixed`} >
                    Next<FaArrowCircleRight />
                  </button>}
              
                </div>
              </div>
            }
            {step === 2 &&
              <div>
                <CourseForm2 formData={formData} handleModule={handleModule} handleChange={handleChange}  validationErrors={form2Errors} setValidationErrors={setForm2ValidationErrors} />
                {step > 1 ?
                  <div className="flex justify-between">
                    <button onClick={backward} className="bg-sky-600 text-white w-24 h-8 rounded-full flex justify-center items-center gap-2 mt-5">
                      <FaArrowAltCircleLeft />  Back
                    </button>
                    <button  className="bg-blue-600 text-white w-24 h-8  rounded-full flex justify-center items-center gap-2 mt-5" type="submit">
                      Submit
                    </button>
                  </div>
                  :
                  <div className="flex justify-between">
                    <button onClick={forward} className="bg-blue-600 text-white w-24 h-8  rounded-full flex justify-center items-center gap-2 fixed" >
                      Next<FaArrowCircleRight />
                    </button>
                  </div>
                }
              </div>
            }
            </form>
          </div>
         
         {loading ? (
         <div className="flex items-center justify-center h-64 w-full">
             <CircularProgress />
            </div>
          ):(
            ''
          )}
        </div>
      </div>
    </div >
  )
}

//   const handleModule = (e: React.ChangeEvent<HTMLElement | HTMLTextAreaElement | HTMLSelectElement>) => {

//     if(e.target instanceof HTMLInputElement && e.target.files){
//       const newModules = formData.module.slice()
//       const index = newModules.length ? newModules.length:0
//       newModules[index].video = e.target.files[0]
      
//       setFromData({
//         ...formData,
//         module:newModules
//       })
//     }
//     setFromData({
//       ...formData,
//       module: [...formData.module, { title: '', video: '', duration: '' }]

//     })
//  console.log(formData.module,'moduleee')
//   }