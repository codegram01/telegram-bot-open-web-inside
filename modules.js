export function isValidURL(url) {
    // Regular expression to match a valid URL format
    // This regex ensures:
    // - Protocol (http or https)
    // - Domain name (no underscores allowed)
    // - Optional port number
    // - Optional path
    const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.){1,}[a-zA-Z]{2,}(:\d{1,5})?(\/\S*)?$/;

    // Test the URL against the pattern
    return urlPattern.test(url);
}

export function updateUrlToHttps(url) {
    if (url.startsWith("https://")) {
        return url;
    }

    if (url.startsWith("http://")) {
        return url.replace(/^http:\/\//, "https://");
    }

    return "https://" + url;
}

export function removeHttpsAndWww(url) {
    // Combine patterns for https and www in one regular expression
    const regex = /^((https?:\/\/)?(?:www\.)?)?/i;
    return url.replace(regex, "");
}

export function convertToUrl(input) {
    // Trim leading and trailing spaces
    let trimmedInput = input.trim();

    // Check if the input already starts with http:// or https://
    if (trimmedInput.startsWith('http://') || trimmedInput.startsWith('https://')) {
        // Remove the protocol part and trim again
        trimmedInput = trimmedInput.replace(/^(https?:\/\/)/, '').trim();
    }

    // Split the trimmed input by spaces, dots, underscores, and spaces
    let parts = trimmedInput.split(/[.\s]+/);
    console.log("------> parts ", parts)

    if (parts.length == 1) {
        parts.push("com")
    }

    // Join all parts to form the final domain and prepend with https://
    let url = 'https://' + parts.join('.');

    return url;
}