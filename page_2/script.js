function encodeText() {
    const text = document.getElementById('textInput').value;
    const encodedText = btoa(encodeURIComponent(text));
    document.getElementById('textOutput').value = encodedText;
}

function decodeText() {
    const encodedText = document.getElementById('textOutput').value;
    const decodedText = decodeURIComponent(atob(encodedText));
    document.getElementById('textInput').value = decodedText;
}

function encodeImage() {
    const fileInput = document.getElementById('imageInput');
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = function(event) {
        const base64String = event.target.result;
        document.getElementById('base64Input').value = base64String;
    };
    reader.readAsDataURL(file);
}

function decodeImage() {
    const base64String = document.getElementById('base64Input').value;
    const imageElement = document.getElementById('imageOutput').querySelector('img');
    if (imageElement) {
        imageElement.src = base64String;
    } else {
        document.getElementById('imageOutput').innerHTML = `<img src="${base64String}" alt="Decoded Image">`;
    }
}

function copyToClipboard(textBoxId) {
    const textBox = document.getElementById(textBoxId);
    textBox.select();
    document.execCommand('copy');
    alert(`Content copied to clipboard from ${textBoxId}`);
}

function encodeFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (!file) {
        alert("Please select a file first.");
        return;
    }
    const reader = new FileReader();
    reader.onload = function(event) {
        const base64String = event.target.result; // 完整的Base64字符串，包括MIME类型
        document.getElementById('fileBase64Input').value = base64String;
    };
    reader.readAsDataURL(file);
}

function decodeFile() {
    const base64String = document.getElementById('fileBase64Input').value;
    if (!base64String) {
        alert("Please enter a valid base64 string.");
        return;
    }
    const blob = base64ToBlob(base64String);

    // 获取用户输入的文件名
    const customFileName = document.getElementById('customFileName').value.trim();
    const defaultFileName = 'decoded_file'; // 默认文件名
    const fileName = customFileName || defaultFileName;

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName; // 设置下载文件的名称
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (!customFileName) {
        alert("No custom file name provided. Using default name: " + defaultFileName);
    }
}

function base64ToBlob(base64) {
    const parts = base64.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);
    for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], {
        type: contentType
    });
}
