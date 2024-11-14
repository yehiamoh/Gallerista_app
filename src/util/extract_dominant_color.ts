import vibrant from "node-vibrant";
const getCompatibleImageUrl = (url: string) => {
   return url.replace("/upload/", "/upload/f_jpg/");
 };
export const dominantColor =async(imagePath:string|undefined)=>{
   try{
      const compatibleImage=getCompatibleImageUrl(imagePath)
      const palette= await vibrant.from(compatibleImage).getPalette();
      const dominantColor=palette.Vibrant.hex;
      return dominantColor || "#000000";
   }
   catch(error){
      console.log(error);
      return "#000000"

   }
}