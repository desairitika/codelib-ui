// Helper function to convert binary data to base64
export const getImageUrl = (image) => {
   if (!image || !image.data || !image.contentType) {
     return null;
   }
 
   // Convert Uint8Array to base64
   const byteArray = new Uint8Array(image.data.data); // Assuming image.data.data is an array of bytes
   let binaryString = '';
   byteArray.forEach((byte) => binaryString += String.fromCharCode(byte));
   
   // Create base64 string
   const base64String = window.btoa(binaryString);
   return `data:${image.contentType};base64,${base64String}`;
 };
 