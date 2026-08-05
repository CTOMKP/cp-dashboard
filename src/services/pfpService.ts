import { getAuthToken } from "@/lib/authSession";
import { uploadPresignedImage } from "@/lib/presignedUpload";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

class PFPService {
  async uploadProfileImage(
    file: File,
    userId: string,
    signal?: AbortSignal,
  ): Promise<{ viewUrl: string; key: string }> {
    if (!file.type.startsWith("image/")) {
      throw new Error("Only image files are allowed");
    }
    if (file.size > MAX_IMAGE_BYTES) {
      throw new Error("Image must be 10MB or less");
    }
    if (!getAuthToken()) {
      throw new Error("Please log in to update your profile picture");
    }
    if (!userId.trim()) {
      throw new Error("User ID is required for upload");
    }

    return uploadPresignedImage("profile", file, { userId, signal });
  }
}

export const pfpService = new PFPService();
