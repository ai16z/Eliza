import { WEB3_STORAGE_API_HOST } from "../constants/apis";

interface UploadResponse {
    success: boolean;
    cid?: string;
    urls?: {
        direct: string;
        raw: string;
        gateway: string;
    };
    type?: string;
    name?: string;
    size?: number;
    error?: string;
}

export async function uploadFileToWeb3Storage(
    base64Data: string,
    fileName = "image.png"
): Promise<UploadResponse> {
    try {
        // Remove base64 URL prefix (if exists)
        const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, "");

        // Convert base64 to Blob
        const byteCharacters = atob(cleanBase64);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "image/png" });

        // Create file object
        const file = new File([blob], fileName, { type: "image/png" });

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(WEB3_STORAGE_API_HOST, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Upload failed with status: ${response.status}`);
        }

        const result: UploadResponse = await response.json();
        return result;
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "upload failed",
        };
    }
}
