import os
import numpy as np
import librosa
import tensorflow as tf
import requests
import pyaudio
import wave
import time
import os

url = "http://127.0.0.1:5000/receive"
#netsh advfirewall firewall add rule name="Flask Port" dir=in action=allow protocol=TCP localport=5000


# ===== Parameters (should match your training settings) =====
SR = 22050
DURATION = 5
N_FFT = 2048
HOP_LENGTH = 512
N_MELS = 128
MAX_TIME_FRAMES = 128
BATCH_SIZE = 32  # The saved model expects a batch of 32


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
    
    # Expand dims to add channel and batch dimensions
    mel_norm = np.expand_dims(mel_norm, axis=-1)  # shape: (128, MAX_TIME_FRAMES, 1)
    mel_norm = np.expand_dims(mel_norm, axis=0)     # shape: (1, 128, MAX_TIME_FRAMES, 1)
    return mel_norm



def compute_reconstruction_loss(original, reconstructed):
    """
    Computes the reconstruction loss (MSE) between the original and reconstructed images.
    """
    return np.mean(np.square(original - reconstructed), axis=(1,2,3))


def detect(path):
    saved_model_path = "saved_vae_gan2"
    loaded_model = tf.saved_model.load(saved_model_path)

    # Get the serving function from the loaded model
    infer = loaded_model.signatures["serving_default"]
    audio_file_path =path
    processed_audio = process_audio_file(audio_file_path)
    input_tensor = tf.convert_to_tensor(processed_audio, dtype=tf.float32)
    if input_tensor.shape[0] != BATCH_SIZE:
        input_tensor = tf.tile(input_tensor, [BATCH_SIZE, 1, 1, 1])
    result = infer(input_tensor)
    print("analyzing audio")
    # The output is typically under the key "output_0" (adjust if necessary)
    reconstructed = result["output_0"]

    # Since all 32 outputs are identical copies, compute loss using the first one.
 
    loss = compute_reconstruction_loss(processed_audio, reconstructed[0:1].numpy())
    THRESHOLD = 0.05
    # if loss > THRESHOLD:
    #     print("anomalyyyyyy")
    lossdata=int(loss[0])
    if loss > THRESHOLD:
        data =   {"message": "Anomaly at Kakkanad","anomaly_type": lossdata,  "date_time": "2025-04-02T07:19:12", "geolocation": "aluva",}
        response = requests.post(url, json=data)
        print("Anomaly detected!")
    else:
        print("none detected")
        
    print(f"Reconstruction loss: {loss[0]:.6f}")




def record_audio(output_path="recording.wav"):
    try:
        os.remove("recording.wav")
        print("Audio file deleted successfully")
    except FileNotFoundError:
        print("File not found - it may have already been deleted")
    """
    Record audio from the microphone and save as WAV file.
    
    Parameters:
        filename (str): Output WAV file name
        duration (int): Recording duration in seconds (default: 2)
        sample_rate (int): Sampling rate in Hz (default: 44100)
        channels (int): Number of audio channels (default: 1 for mono)
    """
    # Initialize PyAudio
    SR = 22050
    DURATION = 2  # 2 seconds
    CHUNK = 1024
    FORMAT = pyaudio.paInt16
    CHANNELS = 1
    """Record exactly 2 seconds of audio from microphone"""
    p = pyaudio.PyAudio()
    
    stream = p.open(format=FORMAT,
                    channels=CHANNELS,
                    rate=SR,
                    input=True,
                    frames_per_buffer=CHUNK)
    
    print("Recording 2 seconds of audio...")
    frames = []
    
    # Calculate total frames needed for 2 seconds
    total_frames = int(SR * DURATION)
    frames_to_record = 0
    
    while frames_to_record < total_frames:
        data = stream.read(CHUNK)
        frames.append(data)
        frames_to_record += CHUNK
    
    print(f"Recorded {len(frames)} chunks ({frames_to_record/SR:.2f} seconds)")
    
    stream.stop_stream()
    stream.close()
    p.terminate()
    
    # Save the recorded data as WAV file
    with wave.open(output_path, 'wb') as wf:
        wf.setnchannels(CHANNELS)
        wf.setsampwidth(p.get_sample_size(FORMAT))
        wf.setframerate(SR)
        wf.writeframes(b''.join(frames))
    
    return output_path


output_path="recording.wav"
sound = output_path

record_audio(output_path)
detect(sound)



