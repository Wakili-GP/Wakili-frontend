import httpClient from "./api/httpClient";

const FILE_ID_REGEX =
  /\/api\/files\/([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})(?:$|[/?#])/i;

const extractFileId = (filePath: string): string | null => {
  const match = filePath.match(FILE_ID_REGEX);
  return match?.[1] ?? null;
};

const getExtensionFromMimeType = (mimeType: string): string => {
  if (!mimeType) return "bin";
  const subtype = mimeType.split("/")[1] ?? "bin";
  return subtype.split("+")[0] || "bin";
};

const fileService = {
  async getFileBlobById(id: string): Promise<Blob> {
    const response = await httpClient.get<Blob>(`/Files/${id}`, {
      responseType: "blob",
    });

    return response.data;
  },

  async pathToFile(filePath: string, fileNamePrefix = "file"): Promise<File> {
    const fileId = extractFileId(filePath);

    if (!fileId) {
      throw new Error("Invalid file path. Expected /api/files/{uuid}.");
    }

    const blob = await this.getFileBlobById(fileId);
    const extension = getExtensionFromMimeType(blob.type);

    return new File([blob], `${fileNamePrefix}.${extension}`, {
      type: blob.type || "application/octet-stream",
    });
  },
};

export default fileService;
