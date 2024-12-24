import imageCompression from "browser-image-compression";
import { useState, useEffect } from "react";
import Compressor from "compressorjs";

export function useCompressedImage(file?: File) {
  
  const [compressedFile, setCompressedFile] = useState<File>();

  useEffect(() => {
    compressFile();
  }, [file]);

  async function compressFile() {
    //setFile(e.target.files[0]);
    if (!file) return;
    // console.log(file);
    // TODO test it later or remove dependency
    // const com = new Compressor(file, {
    //   quality: 0.2,
    //   success(result) {
    //     const formData = new FormData();
    //     formData.append('file', result, result.name);
    //   },
    //   error(err) {
    //     console.log(err.message);
    //   },
    // });

    const options = {
      maxSizeMB: 0.2,
      maxWidthOrHeight: 1920,
      initialQuality: 0.5,
    };
    // console.log(`originalFile size ${file.size / 1024 / 1024} MB`);
    try {
      setCompressedFile(await imageCompression(file, options));
      
      // console.log(
      //   `compressedFile size ${compressedFile.size / 1024 / 1024} MB`
      // ); 

    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  return compressedFile;
}
