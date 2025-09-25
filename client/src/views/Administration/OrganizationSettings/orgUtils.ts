// Type guard for objects with signedUrl
export const hasSignedUrl = (file: unknown): file is { signedUrl: string } => {
  return (
    typeof file === "object" &&
    file !== null &&
    "signedUrl" in file &&
    typeof (file as any).signedUrl === "string"
  );
};
