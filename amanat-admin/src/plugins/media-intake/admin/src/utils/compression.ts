// Native Canvas-based compression to avoid dependencies
export const compressImage = async (file: File): Promise<File> => {
    // Only compress images
    if (!file.type.startsWith('image/')) return file;

    // Settings
    const MAX_WIDTH = 1920;
    const QUALITY = 0.8;

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Resize logic
                if (width > MAX_WIDTH) {
                    height = Math.round((height * MAX_WIDTH) / width);
                    width = MAX_WIDTH;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    // Context not available, return original
                    resolve(file);
                    return;
                }

                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    if (!blob) {
                        resolve(file);
                        return;
                    }
                    const newFile = new File([blob], file.name, {
                        type: 'image/jpeg', // Always convert to JPEG for consistency/compression
                        lastModified: Date.now(),
                    });

                    console.log(`Compressed: ${file.size / 1024 / 1024}MB -> ${newFile.size / 1024 / 1024}MB`);
                    resolve(newFile);
                }, 'image/jpeg', QUALITY);
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
};

export interface CompressionOptions {
    maxSizeMB: number; // Ignored in simple implementation but kept for compatibility
}
