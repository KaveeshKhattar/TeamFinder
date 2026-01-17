import { Button } from "../../../components/ui/button";
import ImageCropper from "./ImageCropper";

interface ModalProps {
  updateProfilePic: (imgSrc: string) => void; // Adjust based on the actual parameter type
  closeModal: () => void; // Adjust based on the actual parameter type
}

const Modal: React.FC<ModalProps> = ({ updateProfilePic, closeModal }) => {
  return (
    <div
      className="relative z-10"
      aria-labelledby="crop-image-dialog"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex justify-center items-center fixed inset-0 bg-gray-900 bg-opacity-75 transition-all backdrop-blur-sm"></div>
      
      <div className="fixed inset-0 z-10 overflow-y-auto text-center m-2">
        <div className="flex min-h-full justify-center px-2 py-12 text-center ">
          <div className="relative w-[95%] sm:w-[80%] min-h-[60vh] rounded-md bg-white dark:bg-black text-left shadow-xl transition-all">
            <div className="px-5 py-4">
              <button
                type="button"
                className="rounded-md inline-flex items-center justify-center absolute top-2 right-2"
                onClick={closeModal}
              >
                <Button variant="secondary" className="mt-1.5">Close</Button>
              </button>
              <ImageCropper updateProfilePic={updateProfilePic} closeModal={closeModal}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Modal;