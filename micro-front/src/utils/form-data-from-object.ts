export function formDataFromObject(obj: Record<string, string | File | string[]>) {
    const formData = new FormData();
    for (const key in obj) {
        if (Array.isArray(obj[key])) {
            for (const value of obj[key]) {
                formData.set(key, value);
            }
        } else {
            formData.set(key, obj[key]);
        }
    }
    return formData;
}