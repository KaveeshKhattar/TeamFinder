import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
} from "react-image-crop";
import { useEffect, useRef, useState } from "react";
import setCanvasPreview from "../setCanvasPreview";
import profilePicture from "../assets/profile-pic.jpg";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Input } from "../../../components/ui/input";
import { createClient } from "@supabase/supabase-js";
import { BASE_URL } from "../../../config";
import { Button } from "../../../components/ui/button";

const ASPECT_RATIO = 1;
const MIN_DIMENSION = 150;

// Create a single supabase client for interacting with your database
const supabase = createClient(
  "https://wyhtuxjmdaffozmmhhxn.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5aHR1eGptZGFmZm96bW1oaHhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc2Nzc4OTcsImV4cCI6MjA0MzI1Mzg5N30.y8fbRONXMoayqAzYkL99HgGr8uXp9Kgwq-EQ-SsR4e8"
);

interface JwtPayload {
  sub: string;
  // Add other properties based on your JWT claims
}

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

const ImageCropper: React.FC<ImageCropperProps> = ({
  updateProfilePic,
  closeModal,
}) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [imageSrc, setImageSrc] = useState<string>();
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 25,
    height: 25,
    x: 0,
    y: 0,
  });
  const [error, setError] = useState("");

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
      });
      setImageSrc(imageUrl);
    });
    reader.readAsDataURL(file);
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const { width, height } = e.currentTarget;
    const croppedWidthInPercent = (MIN_DIMENSION / width) * 100;
    const crop = makeAspectCrop(
      {
        unit: "%",
        width: croppedWidthInPercent,
      },
      ASPECT_RATIO,
      width,
      height
    );
    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
  };

  const handleSetProfilePicture = async () => {
    if (imgRef.current && previewCanvasRef.current) {
      setCanvasPreview(
        imgRef.current,
        previewCanvasRef.current,
        convertToPixelCrop(crop, imgRef.current.width, imgRef.current.height)
      );
    }
    const dataURL = previewCanvasRef.current
      ? previewCanvasRef.current.toDataURL()
      : "";

    updateProfilePic(dataURL);

    // Prepare the form data for the API request
    const token: string | null = localStorage.getItem("token");
    let sub: string | undefined;
    if (token) {
      const decodedToken = jwtDecode<JwtPayload>(token);
      sub = decodedToken.sub;
    }
    if (sub) {
      const index = sub.indexOf(".com");
      const slicedEmail = sub.slice(0, index);
      const formData = new FormData();
      const blob = dataURLtoBlob(dataURL);

      if (blob) {
        formData.append("file", blob, `${slicedEmail}.png`);
      } else {
        console.error("Could not create blob from data URL.");
      }
      console.log("Blob created");

      try {
        const response = await axios.post(
          `${BASE_URL}/users/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Image uploaded successfully:", response.data);
      } catch (error) {
        console.error("Error uploading image:", error);
      }

      console.log("Blob sent");

      try {
        const { data, error } = await supabase.storage
          .from("image-store")
          .createSignedUrl(encodeURIComponent(`${slicedEmail}.png`), 31536000);
        const fileURL = data?.signedUrl;

        if (error) {
          console.error("Error creating signed URL:", error);
        } else {
          console.log("Signed URL:", fileURL);
        }

        const response = await axios.post(
          `${BASE_URL}/users/uploadImageURL`,
          { fileURL: fileURL },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          console.log("file url sent from UI", fileURL);
        } else {
          console.log("file url not sent from UI");
        }
      } catch (err) {
        console.log(err);
      }
    }

    closeModal();
  };

  const dataURLtoBlob = (dataURL: string): Blob | null => {
    // Split the data URL into parts
    const parts = dataURL.split(",");
    if (parts.length !== 2) {
      console.error("Invalid data URL");
      return null; // Return null if the data URL is not in the expected format
    }

    const byteString = atob(parts[1]);
    const mimeStringMatch = parts[0].match(/:(.*?);/);
    if (!mimeStringMatch) {
      console.error("Could not extract mime type");
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

  const profilePic = profilePicture;
  useEffect(() => {
    if (imgRef.current) {
      imgRef.current.src = profilePic;
    }
  }, [profilePic]);

  return (
    <>
      <label className="block mb-3 w-fit">
        <span className="sr-only">Choose profile photo</span>
        <Input
          type="file"
          accept="image/*"
          onChange={onSelectFile}
          className="w-3/4 md:w-full mr-2"
        />
      </label>
      {error && <p className="text-red-500">{error}</p>}
      {imageSrc && (
        <div className="flex flex-col justify-center items-center">
          <ReactCrop
            crop={crop}
            onChange={(percentCrop) => setCrop(percentCrop)}
            circularCrop
            keepSelection
            aspect={ASPECT_RATIO}
            minWidth={MIN_DIMENSION}
          >
            <img
              ref={imgRef}
              src={imageSrc}
              alt=""
              className="max-h-96"
              onLoad={onImageLoad}
            />
          </ReactCrop>
          <div className="flex flex-col justify-center items-center">
            <Button
              className="mt-4 p-2 text-white mb-2"
              onClick={handleSetProfilePicture}
            >
              Set as Profile Picture
            </Button>
            <p className="text-sm text-center text-muted-foreground">It will take 10-15 mins for the changes to reflect (Need money to host on a non-free tier)</p>
          </div>
        </div>
      )}

      {crop && (
        <canvas
          ref={previewCanvasRef}
          className="mt-4 w-[150px] h-[150px] hidden"
        ></canvas>
      )}
    </>
  );
};

export default ImageCropper;
