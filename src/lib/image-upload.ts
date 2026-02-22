/**
 * Lê uma imagem do dispositivo (galeria/câmera) e retorna em data URL,
 * redimensionando se necessário para caber no localStorage.
 */

const MAX_SIZE = 400;
const JPEG_QUALITY = 0.85;

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Arquivo não é uma imagem."));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      // Se for JPEG/PNG e grande, redimensiona para economizar espaço
      if (
        (file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/webp") &&
        (file.size > 200_000 || file.type === "image/png")
      ) {
        resizeImage(dataUrl, MAX_SIZE, JPEG_QUALITY)
          .then(resolve)
          .catch(() => resolve(dataUrl));
      } else {
        resolve(dataUrl);
      }
    };
    reader.onerror = () => reject(new Error("Erro ao ler o arquivo."));
    reader.readAsDataURL(file);
  });
}

function resizeImage(
  dataUrl: string,
  maxSize: number,
  quality: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      let w = img.width;
      let h = img.height;
      if (w <= maxSize && h <= maxSize) {
        resolve(dataUrl);
        return;
      }
      if (w > h) {
        h = Math.round((h * maxSize) / w);
        w = maxSize;
      } else {
        w = Math.round((w * maxSize) / h);
        h = maxSize;
      }
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(dataUrl);
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      try {
        const resized = canvas.toDataURL("image/jpeg", quality);
        resolve(resized);
      } catch {
        resolve(dataUrl);
      }
    };
    img.onerror = () => reject(new Error("Erro ao carregar imagem."));
    img.src = dataUrl;
  });
}
