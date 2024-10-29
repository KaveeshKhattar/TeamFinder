import ReactCrop, { centerCrop, convertToPixelCrop, makeAspectCrop } from 'react-image-crop';
import { useEffect, useRef, useState } from "react";
import setCanvasPreview from '../setCanvasPreview';
import profilePicture from '../assets/profile-pic.jpg'
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const ASPECT_RATIO = 1;
const MIN_DIMENSION = 150;

interface ImageCropperProps {
    updateProfilePic: (imgSrc: string) => void; // Specify the expected type for updateProfilePic
    closeModal: () => void; // Specify the expected type for closeModal
}

interface Crop {
    unit: "%" | "px"; // Ensure only "%" or "px" are allowed
    width: number;
    height: number;
    x: number; // Optional properties based on your usage
    y: number; // Optional properties based on your usage
}

const ImageCropper: React.FC<ImageCropperProps> = ({updateProfilePic, closeModal}) => {
    const imgRef = useRef<HTMLImageElement | null>(null);
    const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const [imageSrc, setImageSrc] = useState<string>();
    const [crop, setCrop] = useState<Crop>({ unit: '%', width: 25, height: 25, x: 0, y: 0  });
    const [error, setError] = useState('');


    const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.addEventListener("load", () => {
            const imageElement = new Image();
            const imageUrl = reader.result ? reader.result.toString() : ""; 
            imageElement.src = imageUrl;
            imageElement.addEventListener("load", () => {
                if (error) setError("");
                const { naturalWidth, naturalHeight } = imageElement;
                if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
                    setError("Image must be 150x150px");
                    return setImageSrc("");
                }
            })
            setImageSrc(imageUrl);
        })
        reader.readAsDataURL(file);
    }

    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const { width, height } = e.currentTarget;
        const croppedWidthInPercent = (MIN_DIMENSION/width)*100;
        const crop = makeAspectCrop({
            unit: "%",
            width: croppedWidthInPercent,
        }, ASPECT_RATIO, width, height);
        const centeredCrop = centerCrop(crop, width, height);
        setCrop(centeredCrop);
    }

    const handleSetProfilePicture = async () => {
        if (imgRef.current && previewCanvasRef.current) {
            setCanvasPreview(
                imgRef.current,
                previewCanvasRef.current,
                convertToPixelCrop(crop, imgRef.current.width, imgRef.current.height)
            );
        }
        const dataURL = previewCanvasRef.current ? previewCanvasRef.current.toDataURL() : "";
        updateProfilePic(dataURL);
    
        // Prepare the form data for the API request
        const token = localStorage.getItem("token");
        const { sub } = jwtDecode(token);
        
        const index = sub.indexOf(".com");
        const slicedEmail = sub.slice(0, index);

        const formData = new FormData();
        formData.append('file', dataURLtoBlob(dataURL), `${slicedEmail}.png`); // Convert data URL to Blob

        try {
            const response = await axios.post('http://localhost:8080/users/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
            });
            console.log('Image uploaded successfully:', response.data);
        } catch (error) {
            console.error('Error uploading image:', error);
        }

        closeModal();
    };

    const dataURLtoBlob = (dataURL: string): Blob | null => {
        // Split the data URL into parts
        const parts = dataURL.split(',');
        if (parts.length !== 2) {
            console.error('Invalid data URL');
            return null; // Return null if the data URL is not in the expected format
        }
    
        const byteString = atob(parts[1]);
        const mimeStringMatch = parts[0].match(/:(.*?);/);
        if (!mimeStringMatch) {
            console.error('Could not extract mime type');
            return null; // Return null if mime type extraction fails
        }
    
        const mimeString = mimeStringMatch[1]; // Safe to access mimeString now
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        
        return new Blob([ab], { type: mimeString });
    };
    
    const profilePic = profilePicture
    useEffect(() => {
        if (imgRef.current) {
            imgRef.current.src = profilePic;
        }
    }, [profilePic]);

    return (
        <>
            <label className="block mb-3 w-fit">
                <span className="sr-only">Choose profile photo</span>
                <input
                    type="file"
                    accept="image/*"
                    onChange={onSelectFile}
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:bg-gray-700 file:text-sky-300 hover:file:bg-gray-600"
                />
            </label>
            {error && <p className='text-red-500'>{error}</p>}
            {
                imageSrc &&
                <div className="flex flex-col items-center">
                    <ReactCrop
                        crop={crop}
                        onChange={(percentCrop) => setCrop(percentCrop)}
                        circularCrop
                        keepSelection
                        aspect={ASPECT_RATIO}
                        minWidth={MIN_DIMENSION}>
                        <img ref={imgRef} src={imageSrc} alt="" className='max-h-96' onLoad={onImageLoad} />
                    </ReactCrop>
                    <button className='mt-4 p-2 bg-blue-500 text-white' onClick={handleSetProfilePicture}>
                        Set as Profile Picture
                    </button>
                </div>
            }

            {crop &&
            <canvas ref={previewCanvasRef} className='mt-4 w-[150px] h-[150px] hidden'>
                
            </canvas>
            }
        </>
    )
}

export default ImageCropper;