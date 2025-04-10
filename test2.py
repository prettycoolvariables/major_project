import os
import numpy as np
import librosa
import tensorflow as tf
import requests
import pyaudio
import wave
import time

# URL to post anomaly data (if needed)
url = "http://127.0.0.1:5000/receive"

# ===== Parameters (should match your training settings) =====
SR = 22050
DURATION = 5               # 5 seconds per recording
N_FFT = 2048
HOP_LENGTH = 512
N_MELS = 128
MAX_TIME_FRAMES = 128
BATCH_SIZE = 32            # The saved model expects a batch of 32

def process_audio_file(file_path, sr=SR, duration=DURATION):
    """
    Load a single audio file, compute its mel-spectrogram (in dB),
    normalize it to [0,1], and pad/truncate to a fixed number of time frames.
    """
    try:
        signal, _ = librosa.load(file_path, sr=sr, duration=duration)
    except Exception as e:
        raise RuntimeError(f"Error loading audio file {file_path}: {e}")
    
    # Compute mel-spectrogram
    mel_spec = librosa.feature.melspectrogram(y=signal, sr=sr, n_fft=N_FFT,
                                              hop_length=HOP_LENGTH, n_mels=N_MELS)
    mel_spec_db = librosa.power_to_db(mel_spec, ref=np.max)
    
    # Normalize to [0, 1]
    mel_norm = (mel_spec_db - np.min(mel_spec_db)) / (np.max(mel_spec_db) - np.min(mel_spec_db) + 1e-9)
    
    # Pad or truncate to fixed number of time frames
    if mel_norm.shape[1] < MAX_TIME_FRAMES:
        pad_width = MAX_TIME_FRAMES - mel_norm.shape[1]
        mel_norm = np.pad(mel_norm, ((0, 0), (0, pad_width)), mode='constant')
    else:
        mel_norm = mel_norm[:, :MAX_TIME_FRAMES]
    
    # Expand dims to add channel and batch dimensions:
    # Final shape: (1, 128, MAX_TIME_FRAMES, 1)
    mel_norm = np.expand_dims(mel_norm, axis=-1)
    mel_norm = np.expand_dims(mel_norm, axis=0)
    return mel_norm

def compute_reconstruction_loss(original, reconstructed):
    """
    Computes the reconstruction loss (MSE) between the original and reconstructed images.
    """
    return np.mean(np.square(original - reconstructed), axis=(1,2,3))

def detect(model, file_path):
    """
    Process the audio file at file_path and run anomaly detection using the provided model.
    """
    # Get the serving function from the loaded model
    infer = model.signatures["serving_default"]

    processed_audio = process_audio_file(file_path)
    input_tensor = tf.convert_to_tensor(processed_audio, dtype=tf.float32)
    
    # Ensure the input batch size matches what the model expects.
    if input_tensor.shape[0] != BATCH_SIZE:
        input_tensor = tf.tile(input_tensor, [BATCH_SIZE, 1, 1, 1])
    
    result = infer(input_tensor)
    print("Analyzing audio...")
    
    # The output is typically under the key "output_0"; adjust if needed.
    reconstructed = result["output_0"]
    
    # Since the 32 outputs are identical copies, we use the first one.
    loss = compute_reconstruction_loss(processed_audio, reconstructed[0:1].numpy())
    
    # Set a threshold based on your validation experiments.
    THRESHOLD = 0.05
    if loss > THRESHOLD:
        print("Anomaly detected!")
        # Example: sending anomaly info to a server endpoint
        # data = {
        #     "message": "Anomaly detected",
        #     "anomaly_value": float(loss[0]),
        #     "date_time": time.strftime("%Y-%m-%dT%H:%M:%S"),
        #     "geolocation": "YourLocation"
        # }
        # response = requests.post(url, json=data)
    else:
        print("No anomaly detected.")
        
    print(f"Reconstruction loss: {loss[0]:.6f}")

def record_audio(output_path="recording.wav", duration=DURATION):
    """
    Record audio from the microphone for 'duration' seconds and save as a WAV file.
    """
    # Delete any existing file
    try:
        os.remove(output_path)
        print("Previous audio file deleted.")
    except FileNotFoundError:
        pass

    CHUNK = 1024
    FORMAT = pyaudio.paInt16
    CHANNELS = 1

    p = pyaudio.PyAudio()
    
    stream = p.open(format=FORMAT,
                    channels=CHANNELS,
                    rate=SR,
                    input=True,
                    frames_per_buffer=CHUNK)
    
    print(f"Recording {duration} seconds of audio...")
    frames = []
    total_frames = int(SR * duration)
    frames_to_record = 0
    
    while frames_to_record < total_frames:
        data = stream.read(CHUNK)
        frames.append(data)
        frames_to_record += CHUNK
    
    print(f"Recorded {len(frames)} chunks ({frames_to_record/SR:.2f} seconds)")
    
    stream.stop_stream()
    stream.close()
    p.terminate()
    
    with wave.open(output_path, 'wb') as wf:
        wf.setnchannels(CHANNELS)
        wf.setsampwidth(p.get_sample_size(FORMAT))
        wf.setframerate(SR)
        wf.writeframes(b''.join(frames))
    
    return output_path

def main():
    # Load the saved model once.
    saved_model_path = "saved_vae_gan"  # Update if needed.
    model = tf.saved_model.load(saved_model_path)
    
    print("Model loaded. Starting continuous anomaly detection...")
    
    while True:
        # Record a 5-second audio clip.
        output_path = record_audio("recording.wav", duration=DURATION)
        # Run anomaly detection on the recorded audio.
        detect(model, output_path)
        # Wait for a short period before starting the next recording.
        time.sleep(1)

if __name__ == "__main__":
    main()