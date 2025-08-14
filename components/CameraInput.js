import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Camera } from 'expo-camera';
import { uploadVideoToCloudinary } from '../utils/cloudinaryUploads';

export default function CameraInput({ onVideoUploaded }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [recording, setRecording] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUri, setPreviewUri] = useState(null);

  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const startRecording = async () => {
    if (!cameraRef.current) return;
    setRecording(true);
    const video = await cameraRef.current.recordAsync({ maxDuration: 15 });
    setRecording(false);
    setPreviewUri(video.uri);
  };

  const stopRecording = () => {
    if (cameraRef.current) cameraRef.current.stopRecording();
  };

  const uploadVideo = async () => {
    if (!previewUri) return;
    setUploading(true);
    try {
      const result = await uploadVideoToCloudinary(previewUri);
      onVideoUploaded(result.secure_url);
    } catch (err) {
      console.error('Upload failed:', err);
    }
    setUploading(false);
  };

  if (hasPermission === null) return <View />;
  if (hasPermission === false) return <Text>No access to camera</Text>;

  return (
    <View style={styles.container}>
      {!previewUri ? (
        <>
          <Camera
            ref={cameraRef}
            style={styles.camera}
            type={'back'}
          />
          <View style={styles.controls}>
            <TouchableOpacity onPress={recording ? stopRecording : startRecording} style={styles.button}>
              <Text style={styles.buttonText}>{recording ? 'Stop' : 'Record'}</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.preview}>
          <Text style={styles.previewText}>Video recorded.</Text>
          <TouchableOpacity onPress={uploadVideo} style={styles.button}>
            <Text style={styles.buttonText}>Upload</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setPreviewUri(null)} style={styles.button}>
            <Text style={styles.buttonText}>Retake</Text>
          </TouchableOpacity>
        </View>
      )}
      {uploading && <ActivityIndicator size="large" color="#000" />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  controls: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#000',
    padding: 12,
    marginHorizontal: 10,
    borderRadius: 6,
  },
  buttonText: { color: '#fff' },
  preview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewText: {
    marginBottom: 20,
    fontSize: 16,
  },
});