import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { X, UploadCloud, Image as RefreshCw } from "lucide-react";

interface ProductImagesManagerProps {
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>; // This allows function updates
  productName: string;
}

interface FileWithPreview {
  file: File;
  preview: string;
  publicId?: string;
}

export default function ProductImagesManager({ images, setImages, productName }: ProductImagesManagerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [filesToUpload, setFilesToUpload] = useState<FileWithPreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Cleanup preview URLs khi component unmount
  useEffect(() => {
    return () => {
      filesToUpload.forEach(({ preview }) => URL.revokeObjectURL(preview));
    };
  }, [filesToUpload]);

  const productNameToSlug = (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "") // remove invalid chars
      .replace(/\s+/g, "-")         // replace spaces with -
      .replace(/-+/g, "-");         // collapse multiple -
  }

  const checkImageDimensions = (file: File, width: number, height: number): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const isValid = img.width === width && img.height === height;
        URL.revokeObjectURL(img.src);
        resolve(isValid);
      };
      img.onerror = () => resolve(false);
      img.src = URL.createObjectURL(file);
    });
  };

  const uploadImageFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    // Đặt folder và public_id theo yêu cầu
    const folder = `product/${productNameToSlug(productName) || "unknown"}`;
    formData.append("folder", folder);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    console.log("Upload response:", data.secure_url);
    return data.secure_url;
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const newFiles = Array.from(event.target.files);
    const validFiles: FileWithPreview[] = [];

    for (const file of newFiles) {
      // Kiểm tra định dạng
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (!ext || !['jpg', 'jpeg', 'png'].includes(ext)) {
        toast.error(`File ${file.name}: Chỉ chấp nhận JPG/PNG`);
        continue;
      }

      // Kiểm tra kích thước file
      if (file.size > 2 * 1024 * 1024) {
        toast.error(`File ${file.name}: Kích thước tối đa 2MB`);
        continue;
      }

      // Kiểm tra kích thước ảnh
      const isValidDimensions = await checkImageDimensions(file, 1020, 570);
      if (!isValidDimensions) {
        toast.error(`File ${file.name}: Kích thước phải là 1020x570px`);
        continue;
      }

      // Kiểm tra trùng lặp với files đã chọn
      const isDuplicate = filesToUpload.some(
        existingFile => existingFile.file.name === file.name && 
                      existingFile.file.size === file.size
      );

      if (!isDuplicate) {
        validFiles.push({
          file,
          preview: URL.createObjectURL(file)
        });
      } else {
        toast.warning(`File ${file.name} đã được chọn`);
      }
    }

    if (validFiles.length > 0) {
      setFilesToUpload(prev => [...prev, ...validFiles]);
    }

    if (inputRef.current) inputRef.current.value = "";
  };

  const handleUpload = async () => {
    if (filesToUpload.length === 0) return;

    setIsUploading(true);
    const toastId = toast.loading("Đang tải lên ảnh...");

    try {
      const uploadedUrls: string[] = [];
      
      for (const { file } of filesToUpload) {
        try {
          const url = await uploadImageFile(file);
          uploadedUrls.push(url);
          toast.success(`Upload ${file.name} thành công`, { id: toastId });
        } catch (error) {
          console.error(`Lỗi upload ${file.name}:`, error);
          toast.error(`Lỗi upload ${file.name}`, { id: toastId });
        }
      }

      // Cập nhật danh sách ảnh sau khi upload thành công
      if (uploadedUrls.length > 0) {
        setImages((prev: string[]) => [...prev, ...uploadedUrls]);
        // Xóa các file đã upload thành công
        setFilesToUpload([]);
      }
    } finally {
      setIsUploading(false);
      toast.dismiss(toastId);
    }
  };

  const removeFileToUpload = (index: number) => {
    const file = filesToUpload[index];
    URL.revokeObjectURL(file.preview);
    
    const newFiles = [...filesToUpload];
    newFiles.splice(index, 1);
    setFilesToUpload(newFiles);
  };

  const removeUploadedImage = () => {
  // const removeUploadedImage = (index: number) => {
    const newImages = [...images];
    // const removedImage = newImages.splice(index, 1)[0];
    
    // Gọi API xóa ảnh trên server nếu cần
    // deleteImageFromServer(removedImage);
    
    setImages(newImages);
    toast.success("Đã xóa ảnh");
  };

  return (
    <div className="space-y-4">
      {/* Input upload */}
      <div className="flex items-center gap-2">
        <Input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png"
          multiple
          onChange={handleFileChange}
          className="cursor-pointer"
        />
        <Button
          type="button"
          onClick={handleUpload}
          disabled={filesToUpload.length === 0 || isUploading}
          className="flex items-center gap-1"
        >
          {isUploading ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <UploadCloud className="h-4 w-4" />
          )}
          Upload
        </Button>
      </div>

      {/* Thông báo */}
      {filesToUpload.length > 0 && (
        <p className="text-sm text-muted-foreground">
          Đã chọn {filesToUpload.length} ảnh để upload
        </p>
      )}

      {/* Preview ảnh đã chọn */}
      {filesToUpload.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {filesToUpload.map(({ preview, file }, index) => (
            <div key={`upload-${index}`} className="relative group h-32 rounded-md overflow-hidden border">
              <img
                src={preview}
                alt={`Preview ${file.name}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                <p className="text-white text-xs truncate w-full">{file.name}</p>
              </div>
              <button
                type="button"
                onClick={() => removeFileToUpload(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                title="Xóa ảnh này"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Ảnh đã upload */}
      {images.length > 0 && (
        <div className="mt-4">
          <h3 className="font-medium mb-2">Ảnh đã tải lên ({images.length})</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {images.map((img, index) => (
              <div key={`uploaded-${index}`} className="relative group h-32 rounded-md overflow-hidden border">
                <img
                  src={img}
                  alt={`Product image ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder-product.png";
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeUploadedImage()}
                  // onClick={() => removeUploadedImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Xóa ảnh này"
                >
                  <X className="h-3 w-3" />
                </button>
                <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1 rounded">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}