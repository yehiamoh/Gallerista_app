import vibrant from "node-vibrant";

// Transform Cloudinary URL to use JPEG format and resize to 200x200 for faster processing
const getCompatibleImageUrl = (url: string) => {
  return url.replace("/upload/", "/upload/f_jpg,w_200,h_200,c_fill/");
};

// Function to get dominant color from transformed URL
export const dominantColor = async (imagePath: string | undefined) => {
  if (!imagePath) return "#000000"; // Fallback color

  const transformedUrl = getCompatibleImageUrl(imagePath);

  try {
    const palette = await vibrant.from(transformedUrl).getPalette();
    return palette.Vibrant?.hex || "#000000"; // Fallback to black if no color is found
  } catch (error) {
    console.log(error);
    return "#000000"; // Fallback to black in case of error
  }
};
