import vibrant from "node-vibrant";

export const dominantColor =async(imagePath:string|undefined)=>{
   try{
      const palette= await vibrant.from(imagePath).getPalette();
      const dominantColor=palette.Vibrant.hex;
      return dominantColor;
   }
   catch(error){
      console.log(error);
   }
}