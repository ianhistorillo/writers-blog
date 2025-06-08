import React, { useState } from "react";
import { Image, X } from "lucide-react";
import Button from "./Button";
import MediaPage from "../../pages/MediaPage";

interface MediaFile {
  id: string;
  filename: string;
  original_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  uploaded_by: string;
  created_at: string;
  public_url?: string;
}

interface MediaSelectorProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
}

const MediaSelector: React.FC<MediaSelectorProps> = ({
  value,
  onChange,
  label = "Cover Image",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (file: MediaFile) => {
    if (file.public_url) {
      onChange(file.public_url);
    }
    setIsOpen(false);
  };

  const handleRemove = () => {
    onChange("");
  };

  const getDefaultImage = () => {
    return "https://images.pexels.com/photos/261763/pexels-photo-261763.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1";
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>

      {value ? (
        <div className="relative">
          <img
            src={value}
            alt="Selected media"
            className="w-full h-48 object-cover rounded-lg border border-gray-300"
            onError={(e) => {
              console.error("Image load error, using default image");
              e.currentTarget.src = getDefaultImage();
            }}
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            title="Remove image"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => setIsOpen(true)}
          className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors bg-gray-50"
        >
          <Image className="h-12 w-12 text-gray-400 mb-2" />
          <p className="text-gray-500 text-center">
            Click to select cover image
            <br />
            <span className="text-sm">No image selected</span>
          </p>
        </div>
      )}

      <div className="mt-2 flex gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => setIsOpen(true)}
        >
          {value ? "Change Media" : "Select Media"}
        </Button>
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
          >
            Remove
          </Button>
        )}
      </div>

      {/* Media Selection Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setIsOpen(false)}
            />

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <MediaPage
                  selectionMode={true}
                  onSelect={handleSelect}
                  onClose={() => setIsOpen(false)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaSelector;
