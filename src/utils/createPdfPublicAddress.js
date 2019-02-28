// @flow
import PDFLib, { PDFDocument, PDFPage } from 'react-native-pdf-lib';
import LapoCoreAndroid from 'lapo-core';
import {
  NativeModules,
  Platform,
} from 'react-native';

const LapoCore = Platform.OS === 'ios' ? NativeModules.RNLapo : LapoCoreAndroid;

const createPDFPublicAddress = async (address: string) => {
  const page1 = PDFPage.create().setMediaBox(800, 800);
  page1.drawText('Lapo public address', {
    x: 45,
    y: 800 - 50,
    fontSize: 34,
    color: '#007386',
  });

  page1.drawText(address, {
    x: 45,
    y: 800 - 100,
    fontSize: 24,
    color: '#007386',
  });

  const pngPath = await LapoCore.generateQRCode(address);

  page1.drawImage(pngPath, 'png', {
    x: 25,
    y: 800 - 320,
    width: 200,
    height: 200,
  });

  // Create a new PDF in your app's private Documents directory
  const docsDir = await PDFLib.getDocumentsDirectory();
  const pdfPath = `${docsDir}/lapoPublic.pdf`;
  await PDFDocument.create(pdfPath)
    .addPages(page1)
    .write();
  return pdfPath;
};

export default createPDFPublicAddress;
