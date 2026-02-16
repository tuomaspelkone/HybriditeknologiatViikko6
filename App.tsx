import { CameraView, useCameraPermissions, BarcodeScanningResult, BarcodeType, CameraType } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BARCODE_TYPES } from './types/BarcodeTypes';

export default function App() {

const [facing, setFacing] = useState<CameraType>('back')
const [permission, requestPermission] = useCameraPermissions()
const [barcode, setBarcode] = useState<string | null>(null)
const [scanned, setScanned] = useState(false)

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission()
    }
  }, [permission, requestPermission])

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'))
  }

  function handleBarcodeScanned(result: BarcodeScanningResult) {
    if (scanned) {
      return;
    }
    setScanned(true);
    setBarcode(result.data);
  }
  

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        barcodeScannerSettings={{
          BarcodeTypes: BARCODE_TYPES,
        }}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
      />
      <View pointerEvents='box-none' style={[StyleSheet.absoluteFill, styles.overlay]}>
        {barcode && (
          <View style={styles.resultCard}>
            <Text style={{ fontSize: 16 }}>Barcode: {barcode}</Text>
            <Button title='Scan Again' onPress={() => { setScanned(false); setBarcode(null); }} />
          </View>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <Text style={styles.text}>Flip Camera</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    paddingTop: 48,
    alignItems: 'center',
  },
  resultCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    margin: 16,
    maxWidth: '90%',
  },
   buttonContainer: {
    position: 'absolute',
    bottom: 64,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    width: '100%',
    paddingHorizontal: 64,
  },
  button: {
    flex: 1,
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
