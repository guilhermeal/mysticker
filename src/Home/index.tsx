import { useEffect, useState, useRef } from 'react';
import { Camera, CameraType } from 'expo-camera';
import { Image, SafeAreaView, ScrollView, TextInput, View, Text, TouchableOpacity} from 'react-native';
import { captureRef } from 'react-native-view-shot'
import * as Sharing from 'expo-sharing';

import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { PositionChoice } from '../components/PositionChoice';

import { styles } from './styles';
import { POSITIONS, PositionProps } from '../utils/positions';

export function Home() {

  const [photo, setPhotoURI] = useState<null | string>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [positionSelected, setPositionSelected] = useState<PositionProps>(POSITIONS[0]);

  const cameraRef = useRef<Camera>(null);
  const screenShotRef = useRef(null);

  async function handleTakePicture() {
    const photo = await cameraRef.current.takePictureAsync();
    setPhotoURI(photo.uri);
  }

  async function handleShareScreenShot(){
    const screenShot = await captureRef(screenShotRef);
    await Sharing.shareAsync(`file://${screenShot}`);
  }

  useEffect(() => {
    Camera.requestCameraPermissionsAsync()
      .then(response => setHasCameraPermission(response.granted))
  }, []);


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View ref={screenShotRef} style={styles.sticker}>
          <Header position={positionSelected} />

          <View style={styles.picture}>

            {
              hasCameraPermission && !photo  
              ?
                <Camera 
                  ref={cameraRef}
                  style={styles.camera} 
                  type={CameraType.front}
                />
              :
                <Image 
                  source={{ uri: photo ? photo : 'https://filestore.community.support.microsoft.com/api/images/490b996b-e45f-4985-b2af-cf36da33849a?upload=true' }} 
                  onLoad={photo ? handleShareScreenShot : null}
                  style={styles.camera} />
            }

            <View style={styles.player}>
              <TextInput
                placeholder="Digite seu nome aqui"
                style={styles.name}
              />
            </View>
          </View>
        </View>

        <PositionChoice
          onChangePosition={setPositionSelected}
          positionSelected={positionSelected}
        />

        <View style={{display: 'flex', flexDirection: 'row' }}>
          
          <Button title="Compartilhar" onPress={handleTakePicture} />
          {photo && <Button title="Tirar outra" typeButton="retry" onPress={() => setPhotoURI(null)} />}

        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
}