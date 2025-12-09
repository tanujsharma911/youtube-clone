"use client";
import {
  ImageCrop,
  ImageCropApply,
  ImageCropContent,
  ImageCropReset,
} from "@/components/ui/shadcn-io/image-crop";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { XIcon } from "lucide-react";
import { type ChangeEvent, useState } from "react";

const ProfileImageCrop = ({ croppedImage, setCroppedImage }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setCroppedImage(null);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setCroppedImage(null);
  };

  if (!selectedFile) {
    return (
      <Input
        accept="image/*"
        className="w-fit"
        onChange={handleFileChange}
        type="file"
      />
    );
  }

  if (croppedImage) {
    return (
      <div className="space-y-4">
        <img alt="Cropped" height={100} src={croppedImage} width={100} />
        <Button
          onClick={handleReset}
          size="icon"
          type="button"
          variant="secondary"
          className="absolute top-2 right-2 bg-white/50"
        >
          <XIcon className="size-5" strokeWidth={2.5} />
        </Button>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <ImageCrop
        aspect={1}
        file={selectedFile}
        maxImageSize={1024 * 1024} // 1MB
        // onChange={console.log}
        // onComplete={() => setProfileImage(croppedImage!)}
        onCrop={setCroppedImage}
      >
        <ImageCropContent className="max-w-md" />
        <div className="flex items-center gap-2">
          <ImageCropApply />
          <ImageCropReset />
          <Button
            onClick={handleReset}
            size="icon"
            type="button"
            variant="ghost"
          >
            <XIcon className="size-4" />
          </Button>
        </div>
      </ImageCrop>
    </div>
  );
};
export default ProfileImageCrop;
