
export function validate(name: string, email: string, contact: string) {
   const nameRegex = /^(?!.*\d)[\w\s]+$|^[\w\s]+$/
   const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
   const contactNumberRegex = /^(?:[0-9] ?){9}[0-9]$/;

   if (!nameRegex.test(name)) {
      return 'Enter a valid name'
   }
   if (!gmailRegex.test(email)) {
      return 'Enter a valid email'
   }
   if (!contactNumberRegex.test(contact)) {

      return 'Enter a valid contact'
   }

   return null
}
export function validatePassword(currentPassword: string, newPassword: string, confirmPassword: string) {
   const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

   if (newPassword !== confirmPassword) {
      return 'Passwords not matching'
   }
   if (!passwordRegex.test(currentPassword)) {
      return 'Enter a valid password'
   }
   if (!passwordRegex.test(newPassword)) {
      return 'Enter a valid new password'
   }
   return null
}
export function validateCourseForm(name: string, description: string, price: string) {
   let errors: { [key: string]: string } = {}
   const stringRegex = /^(?!\s*$)(?!0+$).+/
   const priceRegex = /^[0-9]+(\.[0-9]{1,2})?$/;
   if (!stringRegex.test(name)) {
      errors.name = 'Enter a valid course name'
   }
   if (!stringRegex.test(description)) {
      errors.description = 'Enter a valid description'
   }
   if (!priceRegex.test(price)) {
      errors.price = 'Enter a valid price'
   }

   return errors

}
export const validVideoTypes = [
   'video/mp4',
   'video/webm',
   'video/ogg',
   'video/quicktime',
   'video/x-msvideo',
   'video/x-matroska',
   'video/x-ms-wmv',
]
export function validateSection(title:string,description:string,video:File){
   const stringRegex = /^(?!\s*$)(?!0+$).+/
   let errors: { [key: string]: string } = {}
   if (!stringRegex.test(title)){
       errors.title = 'Enter a valid title'
   }
   if (!stringRegex.test(description)) {
       errors.description = 'Enter a valid description'
   }
   if (video === null){
       errors.video = 'upload a video to continue'
   } else { 
       if (video instanceof File) {
           let type = video.type
           if (!validVideoTypes.includes(type)) {
               errors.video = 'Upload images with mp4 / webm format'
           }
       }
   }
   return errors
}

