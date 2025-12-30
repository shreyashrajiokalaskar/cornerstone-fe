export async function sha256(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);

  // Convert ArrayBuffer to Base64 string (Required by S3)
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const binaryString = hashArray.map((b) => String.fromCharCode(b)).join('');
  return btoa(binaryString);
}
