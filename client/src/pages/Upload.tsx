import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { Spinner } from "@/components/ui/spinner";
import ThumbnailCrop from "@/components/ThumbnailCrop";
import { useState } from "react";
import { convertBase64ToFile } from "@/lib/utils";

type Inputs = {
  title: string;
  description: string;
  thumbnail: FileList;
  videoFile: FileList;
  visibility: "public" | "private";
};

const Upload = () => {
  // -------------------------------- Hooks --------------------------------
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const axios = useAxiosPrivate();
  const navigate = useNavigate();
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  // ------------------------------ Handlers -----------------------------

  const sendFormData = useMutation({
    mutationFn: async (formData: FormData) => {
      try {
        const response = await axios
          .post("/videos", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => res.data);

        return response;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error("Error uploading video");
        throw new Error("Failed to upload video");
      }
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!thumbnail) {
      toast.error("Please crop and set a thumbnail image before uploading.");
      return;
    }
    const thumbnailFile = convertBase64ToFile(thumbnail, "thumbnail.jpg");
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("thumbnail", thumbnailFile);
    formData.append("videoFile", data.videoFile[0]);
    formData.append("visibility", data.visibility);

    const response = await sendFormData.mutateAsync(formData);

    if (response instanceof Error) {
      console.error("Upload Error:", response);
      toast.error("Failed to upload video. Please try again.");
      return;
    }
    console.log("Upload Response:", response);
    toast.success("Video uploaded successfully!");
    navigate("/");
  };

  return (
    <form
      className="flex flex-col gap-8 lg:max-w-[600px] mx-auto"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div>
        <h1 className="text-2xl font-bold mb-4">Upload Video</h1>
      </div>
      <div className="gap-2 flex flex-col">
        <Label htmlFor="thumbnail">Thumbnail Image</Label>
        <ThumbnailCrop
          croppedImage={thumbnail}
          setCroppedImage={setThumbnail}
        />
        {errors && errors.thumbnail && (
          <p className="text-red-500 text-sm">Thumbnail is required</p>
        )}
      </div>
      <div className="gap-2 flex flex-col">
        <Label htmlFor="title">Title</Label>
        <Input
          type="text"
          id="title"
          placeholder="Enter video title"
          {...register("title", { required: true })}
        />
        {errors && errors.title && (
          <p className="text-red-500 text-sm">Title is required</p>
        )}
      </div>

      <div className="gap-2 flex flex-col">
        <Label htmlFor="videoFile">Select Video (Max 100MB)</Label>
        <Input
          type="file"
          accept="video/*"
          {...register("videoFile", { required: true })}
        />
        {errors && errors.videoFile && (
          <p className="text-red-500 text-sm">Video is required</p>
        )}
      </div>
      <div className="gap-2 flex flex-col">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Enter video description"
          {...register("description", { required: true })}
        />
        {errors && errors.description && (
          <p className="text-red-500 text-sm">Description is required</p>
        )}
      </div>
      <div className="gap-2 flex flex-col">
        <Label>Privacy Settings</Label>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <input
              type="radio"
              id="public"
              value="public"
              defaultChecked
              {...register("visibility", { required: true })}
            />
            <label htmlFor="public">Public</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="radio"
              id="private"
              value="private"
              {...register("visibility", { required: true })}
            />
            <label htmlFor="private">Private</label>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          disabled={sendFormData.isPending}
        >
          Cancel
        </Button>
        <Button disabled={sendFormData.isPending}>
          {sendFormData.isPending && <Spinner />}
          Upload
        </Button>
      </div>
    </form>
  );
};

export default Upload;
