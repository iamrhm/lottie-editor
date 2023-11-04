export const convertLottieColorToRGB = (color: Array<number>) => {
  const [r, g, b, a] = color;
  if (a) {
    return {
      r: r * 255,
      g: g * 255,
      b: b * 255,
      a: a / 100,
    };
  } else {
    return {
      r: r * 255,
      g: g * 255,
      b: b * 255,
    };
  }
};

export const convertRGBToLottieColor = (color: {
  r: number;
  g: number;
  b: number;
  a?: number;
}) => {
  const { r, g, b, a = 1 } = color;
  return [r / 255, g / 255, b / 255, a * 100];
};

export const findLeafLayer = (
  lottieFile: LottieJSON,
  layerPath: Array<number>
): LottieLayer => {
  let leafLayer: LottieLayer | undefined;
  layerPath.forEach((path) => {
    if (leafLayer && leafLayer.refId) {
      leafLayer = lottieFile?.assets
        ?.find((asset) => asset.id === leafLayer?.refId)
        ?.layers?.find((layer) => layer.ind === path);
    } else {
      leafLayer = lottieFile.layers.find((layer) => layer.ind === path);
    }
  });
  return leafLayer as LottieLayer;
};

export const findLeafShape = (layer: LottieLayer, shapePath: number[]) => {
  let leafShape: LottieShape | undefined;
  shapePath.forEach((path) => {
    if (leafShape && leafShape.it) {
      leafShape = leafShape.it?.find((shape) => shape.ix === path);
    } else {
      leafShape = layer?.shapes?.find((shape) => shape.ix === path);
    }
  });
  return leafShape as LottieShape;
};

export const getLayerMap = (lottieFile: LottieJSON): EditorLayerMap[] => {
  const layerMap = lottieFile.layers.map((layer) => {
    /* contain nested layers */
    const nestedAssetLayer =
      layer.refId && Array.isArray(lottieFile.assets)
        ? lottieFile.assets.find((asset) => asset.id === layer.refId)
        : null;
    if (nestedAssetLayer) {
      return {
        path: [layer.ind],
        layer: layer,
        assetLayer: {
          id: nestedAssetLayer.id,
          layers: nestedAssetLayer.layers.map((childlayer) => {
            return {
              path: [layer.ind, childlayer.ind],
              layer: childlayer,
            };
          }),
        },
      };
    } else {
      return {
        path: [layer.ind],
        layer: layer,
      };
    }
  });
  return layerMap;
};

export const getLayerColorMap = (
  lottieFile: LottieJSON,
  layerPath: Array<number>
): EditorColorMap[] => {
  const leafLayer = findLeafLayer(lottieFile, layerPath);
  /* find shapes in leaf layer */
  const colorMaps: EditorColorMap[] = [];
  leafLayer?.shapes?.forEach((shape) => {
    if (
      (shape.ty === 'fl' || shape.ty === 'st') &&
      shape.c &&
      Array.isArray(shape.c.k)
    ) {
      colorMaps.push({
        layerPath: layerPath,
        shapePath: [shape.ix] as number[],
        color: [...shape.c.k, shape.o?.k] as number[],
      });
    } else {
      shape.it
        ?.filter(
          (childshape) =>
            (childshape.ty === 'fl' || childshape.ty === 'st') &&
            childshape.c &&
            Array.isArray(childshape.c.k)
        )
        .forEach((coloredShape) => {
          colorMaps.push({
            layerPath: layerPath,
            shapePath: [shape.ix, coloredShape.ix] as number[],
            color: [
              ...(coloredShape?.c?.k || []),
              coloredShape.o?.k,
            ] as number[],
          });
        });
    }
  });
  return colorMaps as EditorColorMap[];
};

export const toggleLayerVisibility = (
  lottieFile: LottieJSON,
  layerPath: Array<number>
): LottieJSON => {
  const leafLayer = findLeafLayer(lottieFile, layerPath);
  leafLayer.ks.o.k = leafLayer.ks.o.k !== 0 ? 0 : 100;
  return lottieFile;
};

export const findAndUpdateColor = (
  lottieFile: LottieJSON,
  updatedColorMap: EditorColorMap
): LottieJSON => {
  const leafLayer = findLeafLayer(lottieFile, updatedColorMap.layerPath);
  const leafShape = updatedColorMap?.shapePath
    ? findLeafShape(leafLayer, updatedColorMap.shapePath)
    : null;

  if (leafShape && leafShape.c) {
    leafShape.c.k =
      updatedColorMap.color.length > 3
        ? updatedColorMap.color.slice(0, 3)
        : updatedColorMap.color;
    if (leafShape.o && leafShape.o.k && updatedColorMap.color.slice(-1)) {
      leafShape.o.k = updatedColorMap.color.slice(-1)[0];
    }
  }
  return lottieFile;
};

export const setupInitialLottie = (lottieFile: LottieJSON): EditorState => {
  const lottieLayers = getLayerMap(lottieFile);
  const allColorMap: EditorColorMap[] = [];
  lottieLayers.forEach((layer) => {
    if (layer.assetLayer) {
      layer.assetLayer.layers.forEach((childLayer) => {
        const layerColors = getLayerColorMap(lottieFile, childLayer.path);
        if (Array.isArray(layerColors)) {
          allColorMap.push(...layerColors);
        }
      });
    } else {
      const layerColors = getLayerColorMap(lottieFile, layer.path);
      if (Array.isArray(layerColors)) {
        allColorMap.push(...layerColors);
      }
    }
  });
  return {
    lottieFile,
    layersMap: lottieLayers,
    colorsMap: allColorMap,
    settings: {
      width: lottieFile.w,
      height: lottieFile.h,
      framerate: lottieFile.fr,
      firstframe: lottieFile.ip,
      lastframe: lottieFile.op,
    },
  };
};
