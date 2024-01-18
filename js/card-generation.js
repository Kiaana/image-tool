document.addEventListener('DOMContentLoaded', () => {
    const messageInput = document.getElementById('message');
    const imageInput = document.getElementById('image-upload');
    const imagePreviewContainer = document.querySelector('.image-preview-container');
    const textPreviewContainer = document.querySelector('.text-preview-container');

    // Handle text input
    messageInput.addEventListener('input', () => {
        textPreviewContainer.textContent = messageInput.value;
    });

    // Handle image upload
    imageInput.addEventListener('change', (event) => {
        const [file] = event.target.files;
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                imagePreviewContainer.innerHTML = ''; // Clear previous image
                imagePreviewContainer.appendChild(img);
            };
            reader.readAsDataURL(file);
        }
    });
});
