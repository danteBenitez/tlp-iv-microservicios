export const resolveImageUrl = (imageId: string) =>
    `${import.meta.env.VITE_API_BASE_URL}products/images/${imageId}`;