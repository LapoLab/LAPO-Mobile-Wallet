// @flow
import PDFLib, { PDFDocument, PDFPage } from 'react-native-pdf-lib';
import LapoCoreAndroid from 'lapo-core';
import {
  NativeModules,
  Platform,
} from 'react-native';

const LapoCore = Platform.OS === 'ios' ? NativeModules.RNLapo : LapoCoreAndroid;

const createPDF = async (paperWords: Array<string>) => {
  const page1 = PDFPage.create().setMediaBox(800, 800);
  page1.drawText('Lapo paper words', {
    x: 45,
    y: 800 - 30,
    fontSize: 34,
    color: '#007386',
  });
  paperWords.forEach((item, index) => {
    page1.drawText(`${index + 1}.  ${item}`, {
      x: 45,
      y: 800 - 30 * (index + 4),
      fontSize: 24,
      color: '#007386',
    });
  });


  const pngPath = await LapoCore.generateQRCode(paperWords.join(' '));

  page1.drawImage(pngPath, 'png', {
    x: 45,
    y: 50,
    width: 200,
    height: 200,
  });

  // Create a new PDF in your app's private Documents directory
  const docsDir = await PDFLib.getDocumentsDirectory();
  const pdfPath = `${docsDir}/lapo.pdf`;
  await PDFDocument.create(pdfPath)
    .addPages(page1)
    .write();
  return pdfPath;
};

export default createPDF;
