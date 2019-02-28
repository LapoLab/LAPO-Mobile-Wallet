// @flow
/* eslint-disable */

import React, { Component } from 'react';
import {
  ActivityIndicator, View, Animated, Easing, Text, Image,
} from 'react-native';
import styles from './styles';

type QRScannerRectViewProps = {
  maskColor: string,
  cornerColor: string,
  borderColor: string,
  rectHeight: number,
  rectWidth: number,
  borderWidth: number,
  cornerBorderWidth: number,
  cornerBorderLength: number,
  isLoading: boolean,
  cornerOffsetSize: number,
  isCornerOffset: boolean,
  bottomMenuHeight: number,
  scanBarAnimateTime: number,
  scanBarColor: string,
  scanBarImage: null,
  scanBarHeight: number,
  scanBarMargin: number,
  hintText: string,
  hintTextStyle: { color: string, fontSize: number, backgroundColor: string },
  hintTextPosition: number,
  isShowScanBar: boolean,
  color: ?string,
};

type QRScannerRectViewState = {
  topWidth: number,
  topHeight: number,
  leftWidth: number,
  animatedValue: any,
};

class QRScannerRectView extends Component<QRScannerRectViewProps, QRScannerRectViewState> {
  state = {
    topWidth: 0,
    topHeight: 0,
    leftWidth: 0,
    animatedValue: new Animated.Value(0),
  };

  componentDidMount() {
    this.scannerLineMove();
  }

  getBackgroundColor = () => ({
    backgroundColor: this.props.maskColor,
  });

  getRectSize = () => ({
    height: this.props.rectHeight,
    width: this.props.rectWidth,
  });

  getBorderSize = () => {
    if (this.props.isCornerOffset) {
      return {
        height: this.props.rectHeight - this.props.cornerOffsetSize * 2,
        width: this.props.rectWidth - this.props.cornerOffsetSize * 2,
      };
    }
    return {
      height: this.props.rectHeight,
      width: this.props.rectWidth,
    };
  };

  getCornerColor = () => ({
    borderColor: this.props.cornerColor,
  });

  getCornerSize = () => ({
    height: this.props.cornerBorderLength,
    width: this.props.cornerBorderLength,
  });

  getBorderWidth = () => ({
    borderWidth: this.props.borderWidth,
  });

  getBorderColor = () => ({
    borderColor: this.props.borderColor,
  });

  renderLoadingIndicator = () => {
    if (!this.props.isLoading) {
      return null;
    }

    return (
      <ActivityIndicator animating={this.props.isLoading} color={this.props.color} size="large" />
    );
  };

  measureTotalSize = (e: Object) => {
    const { layout } = e;
    const { width }: { width: number } = layout;
    this.setState({
      topWidth: width,
    });
  };

  measureRectPosition(e: Object) {
    const rectSize = e.layout;
    this.setState({
      topHeight: rectSize.y,
      leftWidth: rectSize.x,
    });
  }

  getTopMaskHeight() {
    if (this.props.isCornerOffset) {
      return this.state.topHeight + this.props.rectHeight - this.props.cornerOffsetSize;
    }
    return this.state.topHeight + this.props.rectHeight;
  }

  getBottomMaskHeight = () => {
    if (this.props.isCornerOffset) {
      return this.props.rectHeight + this.state.topHeight - this.props.cornerOffsetSize;
    }
    return this.state.topHeight + this.props.rectHeight;
  };

  getSideMaskHeight = () => {
    if (this.props.isCornerOffset) {
      return this.props.rectHeight - this.props.cornerOffsetSize * 2;
    }
    return this.props.rectHeight;
  };

  getSideMaskWidth() {
    if (this.props.isCornerOffset) {
      return this.state.leftWidth + this.props.cornerOffsetSize;
    }
    return this.state.leftWidth;
  }

  getBottomMenuHeight() {
    return {
      bottom: this.props.bottomMenuHeight,
    };
  }

  getScanBarMargin() {
    return {
      marginRight: this.props.scanBarMargin,
      marginLeft: this.props.scanBarMargin,
    };
  }

  getScanImageWidth() {
    return this.props.rectWidth - this.props.scanBarMargin * 2;
  }

  _renderScanBar(): any | null {
    if (!this.props.isShowScanBar) return null;
    if (this.props.scanBarImage) {
      return (
        <Image
          style={{ resizeMode: 'contain', width: this.getScanImageWidth() }}
          source={this.props.scanBarImage}
        />
      );
    }
    return (
      <View
        style={[
          this.getScanBarMargin(),
          {
            backgroundColor: this.props.scanBarColor,
            height: this.props.scanBarHeight,
          },
        ]}
      />
    );
  }

  scannerLineMove() {
    this.state.animatedValue.setValue(0);
    Animated.timing(this.state.animatedValue, {
      toValue: this.props.rectHeight,
      duration: this.props.scanBarAnimateTime,
      easing: Easing.linear,
      sInteraction: false,
      useNativeDriver: true,
    }).start(() => this.scannerLineMove());
  }

  render() {
    const animatedStyle = {
      transform: [{ translateY: this.state.animatedValue }],
    };

    return (
      <View
        onLayout={({ nativeEvent: e }) => this.measureTotalSize(e)}
        style={[styles.container, this.getBottomMenuHeight()]}
      >
        <View
          style={[styles.viewfinder, this.getRectSize()]}
          onLayout={({ nativeEvent: e }) => this.measureRectPosition(e)}
        >
          <View style={[this.getBorderSize(), this.getBorderColor(), this.getBorderWidth()]}>
            <Animated.View style={[animatedStyle]}>{this._renderScanBar()}</Animated.View>
          </View>

          <View
            style={[
              this.getCornerColor(),
              this.getCornerSize(),
              styles.topLeftCorner,
              {
                borderLeftWidth: this.props.cornerBorderWidth,
                borderTopWidth: this.props.cornerBorderWidth,
              },
            ]}
          />

          <View
            style={[
              this.getCornerColor(),
              this.getCornerSize(),
              styles.topRightCorner,
              {
                borderRightWidth: this.props.cornerBorderWidth,
                borderTopWidth: this.props.cornerBorderWidth,
              },
            ]}
          />

          {this.renderLoadingIndicator()}

          <View
            style={[
              this.getCornerColor(),
              this.getCornerSize(),
              styles.bottomLeftCorner,
              {
                borderLeftWidth: this.props.cornerBorderWidth,
                borderBottomWidth: this.props.cornerBorderWidth,
              },
            ]}
          />

          <View
            style={[
              this.getCornerColor(),
              this.getCornerSize(),
              styles.bottomRightCorner,
              {
                borderRightWidth: this.props.cornerBorderWidth,
                borderBottomWidth: this.props.cornerBorderWidth,
              },
            ]}
          />
        </View>

        <View
          style={[
            this.getBackgroundColor(),
            styles.topMask,
            {
              bottom: this.getTopMaskHeight(),
              width: this.state.topWidth,
            },
          ]}
        />

        <View
          style={[
            this.getBackgroundColor(),
            styles.leftMask,
            {
              height: this.getSideMaskHeight(),
              width: this.getSideMaskWidth(),
            },
          ]}
        />

        <View
          style={[
            this.getBackgroundColor(),
            styles.rightMask,
            {
              height: this.getSideMaskHeight(),
              width: this.getSideMaskWidth(),
            },
          ]}
        />

        <View
          style={[
            this.getBackgroundColor(),
            styles.bottomMask,
            {
              top: this.getBottomMaskHeight(),
              width: this.state.topWidth,
            },
          ]}
        />

        <View style={{ position: 'absolute', bottom: this.props.hintTextPosition }}>
          <Text style={this.props.hintTextStyle}>{this.props.hintText}</Text>
        </View>
      </View>
    );
  }
}

export default QRScannerRectView;
