// Handle file uploads
document.addEventListener("DOMContentLoaded", function () {
    var dropZone = document.getElementById('drop-zone');
    var uploadInput = document.getElementById('image-upload');
    var imageList = document.getElementById('image-list').querySelector('tbody');
    var startProcessingButton = document.getElementById('start-processing'); // Make sure this ID matches your button
    var downloadAsZipButton = document.getElementById('download-as-zip'); // Make sure this ID matches your button
    var clearAllButton = document.getElementById('clear-all'); // Make sure this ID matches your button
    var uploadedFiles = [];


    // Function to invert image colors and update the row
    function processImageRow(row, file) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var img = new Image();
            img.onload = function () {
                // Invert image colors
                var invertedImageUrl = invertImageColors(img);

                // Update thumbnail in the row
                var thumbnailCell = row.querySelector('img');
                thumbnailCell.src = invertedImageUrl;

                // Add download button
                var downloadButton = setupDownloadButton(invertedImageUrl, 'inverted-' + file.name);
                row.cells[1].innerHTML = ''; // Clear the "Process" button
                row.cells[1].appendChild(downloadButton);
            };
            img.src = e.target.result;

        };
        reader.readAsDataURL(file);
    }

    // Download a single image
    function setupDownloadButton(imageDataUrl, fileName) {
        var downloadButton = document.createElement('a');
        downloadButton.href = imageDataUrl;
        downloadButton.download = fileName;
        downloadButton.textContent = 'Download';
        downloadButton.classList.add('text-blue-600', 'hover:text-blue-800');
        return downloadButton;
    }

    // Invert image colors
    function invertImageColors(image) {
        // Create an off-screen canvas
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.width = image.width;
        canvas.height = image.height;

        // Draw the image on the canvas
        ctx.drawImage(image, 0, 0);

        // Get the image's pixel data
        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var data = imageData.data;

        // Invert each pixel's color
        for (var i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i];       // red
            data[i + 1] = 255 - data[i + 1]; // green
            data[i + 2] = 255 - data[i + 2]; // blue
            // data[i + 3] is the alpha channel
        }

        // Put the inverted data back on the canvas
        ctx.putImageData(imageData, 0, 0);

        // Return the canvas image as a data URL
        return canvas.toDataURL();
    }

    // Bind click on "Process" button of each row
    function createTableRow(file, imageUrl) {
        var tr = document.createElement('tr');
        tr.classList.add('border-b', 'border-gray-200');

        // Store the index of the file in the uploadedFiles array in the tr's data attribute
        var fileIndex = uploadedFiles.push(file) - 1;
        tr.dataset.fileIndex = fileIndex;

        var thumbnailCell = tr.insertCell();
        thumbnailCell.classList.add('px-6', 'py-4', 'whitespace-no-wrap', 'text-sm', 'leading-5');
        thumbnailCell.innerHTML = `<div class="flex items-center">
                                        <img src="${imageUrl}" alt="${file.name}" class="h-20 w-20 object-cover mr-4">
                                        <span class="file-name truncate">${file.name}</span>
                                    </div>`;
        // Process cell with the process button
        var processCell = tr.insertCell();
        processCell.classList.add('px-6', 'py-4', 'whitespace-no-wrap', 'text-right', 'text-sm', 'leading-5');
        processCell.innerHTML = '<button class="process-button text-indigo-600 hover:text-indigo-900">Process</button>';

        // Remove cell with the remove button
        var removeCell = tr.insertCell();
        removeCell.classList.add('px-6', 'py-4', 'whitespace-no-wrap', 'text-right', 'text-sm', 'leading-5');
        var removeButton = document.createElement('button');
        removeButton.innerText = 'Remove';
        removeButton.classList.add('text-red-600', 'hover:text-red-900');
        removeButton.addEventListener('click', function () {
            tr.remove();
            // Remove the file from the uploadedFiles array
            delete uploadedFiles[tr.dataset.fileIndex];
            // Check if the "Start Processing" button should be hidden
            if (imageList.querySelectorAll('tr').length === 0) {
                checkButtons(startProcessingButton, 'hide');
                checkButtons(downloadAsZipButton, 'hide');
                checkButtons(clearAllButton, 'hide');
            }
        });
        removeCell.appendChild(removeButton);

        imageList.appendChild(tr);

        // Bind the process button event after appending the row
        var processButton = processCell.querySelector('.process-button');
        processButton.addEventListener('click', function () {
            processImageRow(tr, file);
            console.log('Processing image: ' + file.name);
        });
    }

    // Start processing all images
    startProcessingButton.addEventListener('click', function () {
        // Get all the tr elements
        var rows = imageList.querySelectorAll('tr');
        rows.forEach(tr => {
            // Check if the row has already been processed
            if (tr.querySelector('a')) return;
            // Retrieve the file index from the tr's data attribute
            var fileIndex = tr.dataset.fileIndex;
            // Retrieve the file from the uploadedFiles array
            var fileToProcess = uploadedFiles[fileIndex];
            // Check if the file exists and then process it
            if (fileToProcess) {
                processImageRow(tr, fileToProcess);
            }
        });

        // Show the "Download All as Zip" button after processing
        // Check if the button is visible
        checkButtons(downloadAsZipButton);
        // Show the "Clear All" button after processing
        // Check if the button is visible
        checkButtons(clearAllButton);

    });

    // Check and show Buttons
    function checkButtons(button, hideOrShow = 'show') {
        // Check if the button is visible
        if (hideOrShow === 'hide') {
            if (!button.classList.contains('hidden')) {
                button.classList.add('hidden');
                button.style.opacity = '0';
            }
        }
        else {
            if (button.classList.contains('hidden')) {
                button.classList.remove('hidden');
                button.style.opacity = '1';
            }
        }
    }

    // Buttons functionality
    // Clear all images
    clearAllButton.addEventListener('click', function () {
        // Get all the tr elements
        var rows = imageList.querySelectorAll('tr');
        rows.forEach(tr => {
            tr.remove();
        });
        // Clear the uploadedFiles array
        uploadedFiles = [];
        // Hide the "Download All as Zip" button
        downloadAsZipButton.classList.add('hidden');
        downloadAsZipButton.style.opacity = '0';
        // Hide the "Clear All" button
        clearAllButton.classList.add('hidden');
        clearAllButton.style.opacity = '0';
        // Hide the "Start Processing" button
        startProcessingButton.classList.add('hidden');
        startProcessingButton.style.opacity = '0';
    });

    // Download all images as a zip file
    downloadAsZipButton.addEventListener('click', downloadAllAsZip);

    function downloadAllAsZip() {
        var zip = new JSZip();
        var images = document.querySelectorAll('#image-list tbody img');
        images.forEach(function (img, index) {
            var fileName = 'inverted-image-' + (index + 1) + '.png';
            var dataUrl = img.src;
            var base64Data = dataUrl.replace(/^data:image\/(png|jpg);base64,/, "");
            zip.file(fileName, base64Data, { base64: true });
        });

        zip.generateAsync({ type: "blob" }).then(function (content) {
            saveAs(content, "inverted-images.zip");
        });
    }

    function setupDragAndDrop() {
        dropZone.addEventListener('dragover', handleDragOver);
        dropZone.addEventListener('dragleave', handleDragLeave);
        dropZone.addEventListener('drop', handleDrop);
        dropZone.addEventListener('click', function () {
            uploadInput.click();
        });
        uploadInput.addEventListener('change', handleFiles);
    }

    function handleFiles(e) {
        var files = e.target.files || e.dataTransfer.files;
        for (let i = 0, len = files.length; i < len; i++) { // Changed var to let for block-scoping
            let file = files[i]; // Using let ensures file is block-scoped
            console.log(file);
            var reader = new FileReader();
            reader.onload = (function (file) { // Wrap the function with an IIFE
                return function (e) {
                    createTableRow(file, e.target.result);
                };
            })(file); // Immediately invoke the function passing the current file
            reader.readAsDataURL(file);
        }
        checkButtons(startProcessingButton);
    }


    function handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.add('hover:border-gray-300', 'hover:bg-gray-100');
    }

    function handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.remove('hover:border-gray-300', 'hover:bg-gray-100');
    }

    function handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.remove('hover:border-gray-300', 'hover:bg-gray-100');
        handleFiles(e);
    }

    setupDragAndDrop();
});


