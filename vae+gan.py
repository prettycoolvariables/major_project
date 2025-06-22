import os
import numpy as np
import librosa
import tensorflow as tf

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
    mel_spec = librosa.feature.melspectrogram(y=signal, sr=sr, n_fft=N_FFT,hop_length=HOP_LENGTH, n_mels=N_MELS)
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
    mel_norm = np.expand_dims(mel_norm, axis=-1)    # shape: (128, MAX_TIME_FRAMES, 1)
    mel_norm = np.expand_dims(mel_norm, axis=0)     # shape: (1, 128, MAX_TIME_FRAMES, 1)
    return mel_norm

def compute_reconstruction_loss(original, reconstructed):
    """
    Computes the reconstruction loss (MSE) between the original and reconstructed images.
    """
    return np.mean(np.square(original - reconstructed), axis=(1,2,3))

def main():
    # Path to the SavedModel directory (from tf.saved_model.save)
    saved_model_path = "saved_vae_gan"  

    # Load the saved VAE+GAN model
    loaded_model = tf.saved_model.load(saved_model_path)
    
    # Get the serving function from the loaded model
    infer = loaded_model.signatures["serving_default"]

    # The path to the single audio file to test
    audio_file_path = "/Users/aiswaryamariamjacob/Major Project/7-13.wav"  
    #audio_file_path ="/Users/aiswaryamariamjacob/Major Project/19291472/Road Noises/road1.wav"
    #audio_file_path ="/Users/aiswaryamariamjacob/Major Project/2020-08-29-16-07_Hohenwarte_unknownKmh_4115392_M_D_MR_ME_CH12.wav"

    # Process the audio file into a spectrogram image
    processed_audio = process_audio_file(audio_file_path)
    
    # Convert to tensor and adjust batch size:
    input_tensor = tf.convert_to_tensor(processed_audio, dtype=tf.float32)
    # The saved model expects a batch of size 32. Tile the single sample to match that:
    if input_tensor.shape[0] != BATCH_SIZE:
        input_tensor = tf.tile(input_tensor, [BATCH_SIZE, 1, 1, 1])
    
    # Run inference using the serving signature
    result = infer(input_tensor)
    
    # The output is typically under the key "output_0" 
    reconstructed = result["output_0"]
    
    # Since all 32 outputs are identical copies, compute loss using the first one.
    loss = compute_reconstruction_loss(processed_audio, reconstructed[0:1].numpy())
    
    # A threshold for anomaly detection is determine based on validation experiments
    THRESHOLD = 0.0596

    if loss > THRESHOLD:
        print("Anomaly detected!")
    else:
        print("Audio file is normal.")
    print(f"Reconstruction loss: {loss[0]:.6f}")

if __name__ == "__main__":
    main()
