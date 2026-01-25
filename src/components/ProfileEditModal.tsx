import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Cropper from "react-easy-crop";
import { Slider } from "@/components/ui/slider";
import { Upload } from "lucide-react";
interface ProfileData {
  name: string;
  location: string;
  bio: string;
  profileImage: string;
}
interface ProfileEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentData: ProfileData;
  onSave: (data: ProfileData) => void;
}
const ProfileEditModal = ({
  open,
  onOpenChange,
  currentData,
  onSave,
}: ProfileEditModalProps) => {
  const [name, setName] = useState(currentData.name);
  const [location, setLocation] = useState(currentData.location);
  const [bio, setBio] = useState(currentData.bio);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const onCropComplete = useCallback(
    (
      _croppedArea: unknown,
      croppedAreaPixels: {
        x: number;
        y: number;
        width: number;
        height: number;
      },
    ) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );
  const createCroppedImage = async () => {
    if (!imageSrc || !croppedAreaPixels) return null;
    const image = new Image();
    image.src = imageSrc;
    return new Promise((resolve) => {
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;
        if (ctx) {
          ctx.drawImage(
            image,
            croppedAreaPixels.x,
            croppedAreaPixels.y,
            croppedAreaPixels.height,
            croppedAreaPixels.width,
            0,
            0,
            croppedAreaPixels.width,
            croppedAreaPixels.height,
          );
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(URL.createObjectURL(blob));
            }
          }, "image/jpeg");
        }
      };
    });
  };
  const handleSave = async () => {
    let finalImage = currentData.profileImage;
    if (showCropper && imageSrc) {
      const croppedImage = await createCroppedImage();
      if (croppedImage) {
        finalImage = croppedImage as string;
      }
    }
    onSave({ name, location, bio, profileImage: finalImage });
    // toast.success("تم تحديث الملف الشخصي بنجاح");
    onOpenChange(false);
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageSrc(reader.result as string);
        setShowCropper(true);
      });
      reader.readAsDataURL(file);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        dir="rtl"
      >
        <DialogHeader>
          <DialogTitle className="mt-3">تعديل الملف الشخصي</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Profile Image Section */}
          <div className="space-y-4">
            <Label>الصورة الشخصية</Label>
            <div className="flex flex-col items-center gap-4">
              {showCropper && imageSrc ? (
                <div className="w-full">
                  <div className="relative w-full h-64 bg-muted rounded-lg overflow-hidden">
                    <Cropper
                      image={imageSrc}
                      crop={crop}
                      zoom={zoom}
                      aspect={1}
                      cropShape="round"
                      showGrid={false}
                      onCropChange={setCrop}
                      onCropComplete={onCropComplete}
                      onZoomChange={setZoom}
                    />
                  </div>
                  <div className="mt-4 space-y-2">
                    <Label>تكبير / تصغير</Label>
                    <Slider
                      value={[zoom]}
                      onValueChange={(value) => setZoom(value[0])}
                      min={1}
                      max={3}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowCropper(false);
                      setImageSrc(null);
                    }}
                    className="cursor-pointer mt-4 w-full"
                  >
                    إلغاء الصورة
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <img
                    src={currentData.profileImage}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-border"
                  />
                  <Label htmlFor="profile-image" className="cursor-pointer">
                    <div className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary-hover transition-colors">
                      <Upload className="w-4 h-4" />
                      <span>اختر صورة جديدة</span>
                    </div>
                  </Label>
                  <Input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              )}
            </div>
          </div>
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">الاسم</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="أدخل اسمك"
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">الموقع</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="أدخل موقعك"
            />
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">نبذة مختصرة</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="أخبرنا عن نفسك"
              rows={4}
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <Button
            className="cursor-pointer"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            إلغاء
          </Button>
          <Button className="cursor-pointer" onClick={handleSave}>
            حفظ التغييرات
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default ProfileEditModal;
