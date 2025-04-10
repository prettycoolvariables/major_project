# Traffic Anomaly Detection System

## Overview

This project is a React-based web application that detects traffic anomalies (specifically accidents) using a VAE+GAN machine learning model. The system analyzes sound data to classify potential accidents and displays real-time alerts on the website.

## Features

- Real-time traffic anomaly detection
- Sound data analysis using VAE+GAN model
- Visual alerts for detected accidents

## Technologies Used

- **Frontend**: React.js
- **Audio Processing**: VAE (Variational Autoencoder) + GAN (Generative Adversarial Network) model
- **Backend**: Flask, SQLAlchemy

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/prettycoolvariables/major_project.git
   cd major_project
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server(split terminal):

   ```bash
   cd frontend
   npm start

   cd backend
   python server.py
   ```

4. Open your browser and navigate to `http://localhost:3000`. For APIs, go to `http://127.0.0.1:5000/apidocs`

## Usage

1. Launch the application
2. The system will automatically start monitoring audio input (from microphone or audio files)
3. Detected anomalies will appear as visual alerts on the dashboard
4. Users can view details of each detected event

## Machine Learning Model

Our VAE+GAN model works as follows:

- The VAE encodes sound data into a latent space representation
- The GAN helps identify deviations from normal traffic patterns
- When reconstruction error exceeds a threshold, an anomaly is flagged

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature-branch`)
5. Open a Pull Request
