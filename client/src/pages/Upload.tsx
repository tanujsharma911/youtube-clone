import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Upload = () => {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">Upload Video</h1>
      </div>
      <div className="gap-2 flex flex-col">
        <Label htmlFor="title">Title</Label>
        <Input type="text" id="title" placeholder="Enter video title" />
      </div>
      <div className="gap-2 flex flex-col">
        <Label htmlFor="thumbnail">Thumbnail Image</Label>
        <Input type="file" accept="image/*" />
      </div>
      <div className="gap-2 flex flex-col">
        <Label htmlFor="video">Select Video</Label>
        <Input type="file" accept="video/*" />
      </div>
      <div className="gap-2 flex flex-col">
        <Label htmlFor="description">Description</Label>
        <Input
          type="text"
          id="description"
          placeholder="Enter video description"
        />
      </div>
    </div>
  );
};

export default Upload;
