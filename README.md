# .py file for Edge device(model)

## Overview

This consists of the python script that runs the model in path 'saved_vae_gan' to detect anomalies.

## Machine Learning Model

Our VAE+GAN model works as follows:

- The VAE encodes sound data into a latent space representation
- The GAN helps identify deviations from normal traffic patterns
- When reconstruction error exceeds a threshold, an anomaly is flagged

