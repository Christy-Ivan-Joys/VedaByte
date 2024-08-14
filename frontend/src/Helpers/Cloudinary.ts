import { CloudinaryInput } from "../types";

async function upload(method: string, body: CloudinaryInput){
    return await fetch(`https://api.cloudinary.com/v1_1/dzhdkfjsw/image/upload`, {
        method: method,
        body: body as unknown as BodyInit,

    })
}  
 export const handleImageUpload = async (imageData: any) => {
    console.log(imageData)
    const upload = await fetch(`https://api.cloudinary.com/v1_1/dzhdkfjsw/image/upload`, {
        method: 'POST',
        body: imageData
    })
    return await upload.json()
}

export const uploadVideo = async (videoData: any) => {
    const res = await fetch(`https://api.cloudinary.com/v1_1/dzhdkfjsw/video/upload`, {
        method: 'POST',
        body: videoData
    })
    return await res.json()
}
export default upload

export const handlefileUpload = async (Data: any) => {
    console.log(Data)
    const upload = await fetch(`https://api.cloudinary.com/v1_1/dzhdkfjsw/upload`, {
        method: 'POST',
        body:Data
    })
    return await upload.json()
}      

