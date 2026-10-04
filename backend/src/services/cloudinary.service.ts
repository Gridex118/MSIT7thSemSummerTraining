import { v2 as cloudinary } from "cloudinary";
import { ServiceError } from "../errors.ts";

cloudinary.config({ secure: true });
type AvatarFolderType = "users" | "groups";
export function uploadAvatarImage(
  buffer: Buffer,
  folder: AvatarFolderType,
  id: string,
) {
  return new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `bookapp/avatars/${folder}`,
        public_id: id,
        overwrite: true,
        invalidate: true,
        resource_type: "image",
        allowed_formats: ["jpg", "png", "webp"],
        transformation: [
          { width: 256, height: 256, crop: "fill", gravity: "auto" },
        ],
      },
      (err, result) => {
        if (err || !result) {
          const message = `Image upload failed\nCloudinary gave:\n${err}`;
          return reject(new ServiceError(502, message));
        }
        resolve(result.secure_url);
      },
    );
    stream.end(buffer);
  });
}
