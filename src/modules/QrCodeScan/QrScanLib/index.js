// @flow
/* eslint-disable */

import React, { Component } from 'react';
import { RNCamera } from 'react-native-camera';
import { View } from 'react-native';

import QRScannerRectView from './QRScannerRectView';
import styles from './styles';

type QRScannerViewProps = {
  maskColor: string,
  borderColor: string,
  cornerColor: string,
  borderWidth: number,
  cornerBorderWidth: number,
  cornerBorderLength: number,
  rectHeight: number,
  rectWidth: number,
  isLoading: boolean,
  isCornerOffset: boolean,
  cornerOffsetSize: number,
  bottomMenuHeight: number,
  scanBarAnimateTime: number,
  scanBarColor: string,
  scanBarImage: any,
  scanBarHeight: number,
  scanBarMargin: number,
  hintText: string,
  hintTextStyle: any,
  hintTextPosition: number,
  renderTopBarView: any,
  renderBottomMenuView: any,
  isShowScanBar: boolean,
  bottomMenuStyle: any,
  onScanResultReceived: any,
};

export default class QRScannerView extends Component<QRScannerViewProps> {
  static defaultProps = {
    maskColor: '#0000004D',
    cornerColor: '#22ff00',
    borderColor: '#000000',
    rectHeight: 200,
    rectWidth: 200,
    borderWidth: 0,
    cornerBorderWidth: 4,
    cornerBorderLength: 20,
    isLoading: false,
    cornerOffsetSize: 0,
    isCornerOffset: false,
    bottomMenuHeight: 0,
    scanBarAnimateTime: 2500,
    scanBarColor: '#22ff00',
    scanBarImage: null,
    scanBarHeight: 1.5,
    scanBarMargin: 6,
    hintText: 'hintText',
    hintTextStyle: { color: '#fff', fontSize: 14, backgroundColor: 'transparent' },
    hintTextPosition: 130,
    isShowScanBar: true,
    renderBottomMenuView: null,
    renderTopBarView: null,
    bottomMenuStyle: null,
  };

  render() {
    const {
      onScanResultReceived,
      renderTopBarView,
      maskColor,
      cornerColor,
      borderColor,
      rectHeight,
      rectWidth,
      borderWidth,
      cornerBorderWidth,
      cornerBorderLength,
      isLoading,
      cornerOffsetSize,
      isCornerOffset,
      bottomMenuHeight,
      scanBarAnimateTime,
      scanBarColor,
      scanBarHeight,
      scanBarMargin,
      hintText,
      hintTextStyle,
      scanBarImage,
      hintTextPosition,
      isShowScanBar,
      bottomMenuStyle,
      renderBottomMenuView,

    } = this.props;
    return (
      <RNCamera
        onBarCodeRead={onScanResultReceived}
        style={styles.rnCamera}
        permissionDialogTitle="Permission to use camera"
        permissionDialogMessage="We need your permission to use your camera phone"
      >
        {renderTopBarView && renderTopBarView()}

        <QRScannerRectView
          maskColor={maskColor}
          cornerColor={cornerColor}
          borderColor={borderColor}
          rectHeight={rectHeight}
          rectWidth={rectWidth}
          borderWidth={borderWidth}
          cornerBorderWidth={cornerBorderWidth}
          cornerBorderLength={cornerBorderLength}
          isLoading={isLoading}
          cornerOffsetSize={cornerOffsetSize}
          isCornerOffset={isCornerOffset}
          bottomMenuHeight={bottomMenuHeight}
          scanBarAnimateTime={scanBarAnimateTime}
          scanBarColor={scanBarColor}
          scanBarHeight={scanBarHeight}
          scanBarMargin={scanBarMargin}
          hintText={hintText}
          hintTextStyle={hintTextStyle}
          scanBarImage={scanBarImage}
          hintTextPosition={hintTextPosition}
          isShowScanBar={isShowScanBar}
          color={null}
        />

        <View style={[styles.buttonsContainer, bottomMenuStyle]}>
          {renderBottomMenuView && renderBottomMenuView()}
        </View>
      </RNCamera>
    );
  }
}
