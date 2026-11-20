export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.url) {
    throw new Error(data.message || "Image upload failed. Please try again.");
  }

  return data.url as string;
}