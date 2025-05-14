class Camera {
    constructor() {
        if (!("mediaDevices" in navigator) || !("getUserMedia" in navigator.mediaDevices)) {
            throw new Error('Camera API not supported in this browser');
        }
        this.stream = null;
        this.facingMode = "user"; // "user" for front, "environment" for back
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

const savePhotoButton = document.getElementById('savePhoto');
savePhotoButton.addEventListener('click', () => {
  const canvas = document.getElementById('photoCanvas');
  const image = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = image;
  link.download = 'photo.png';
  link.click();
});

export default Camera;