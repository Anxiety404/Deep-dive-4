class Camera {
    constructor() {
        if (!("mediaDevices" in navigator) || !("getUserMedia" in navigator.mediaDevices)) {
            throw new Error('Camera API not supported in this browser');
        }
        this.stream = null;
        this.facingMode = "user";
    }

    async getStream() {
        if (this.stream) {
            return this.stream;
        }
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: this.facingMode }
            });
            return this.stream;
        } catch (error) {
            this.stopStream();
            console.error('Error accessing camera:', error);
            throw error;
        }
    }

    async switchCamera() {
        this.facingMode = this.facingMode === "user" ? "environment" : "user";
        this.stopStream();
        return await this.getStream();
    }

    stopStream() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
    }
}

const takePhotoButton = document.getElementById('takePhoto');
takePhotoButton.addEventListener('click', () => {
    const video = document.getElementById('cameraFeed');
    const canvas = document.getElementById('photoCanvas');
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
});

const camera = new Camera();
const video = document.getElementById('cameraFeed');
const startCameraButton = document.getElementById('startCamera');
const stopCameraButton = document.getElementById('stopCamera');

startCameraButton.addEventListener('click', async () => {
    try {
        const stream = await camera.getStream();
        video.srcObject = stream;
    } catch (err) {
        alert('Could not start camera: ' + err.message);
    }
});

stopCameraButton.addEventListener('click', () => {
    camera.stopStream();
    video.srcObject = null;
});

const savePhotoButton = document.getElementById('savePhoto');
savePhotoButton.addEventListener('click', () => {
    const canvas = document.getElementById('photoCanvas');
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = 'photo.png';
    link.click();
});

const switchCameraButton = document.getElementById('switchCamera');
switchCameraButton.addEventListener('click', async () => {
    try {
        const stream = await camera.switchCamera();
        video.srcObject = stream;
    } catch (err) {
        alert('Could not switch camera: ' + err.message);
    }
});