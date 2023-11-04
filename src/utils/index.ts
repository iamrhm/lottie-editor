export const _convertLottieColorToRGB = (color: Array<number>) => {
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

export const _convertRGBToLottieColor = (color: {
  r: number;
  g: number;
  b: number;
  a?: number;
}) => {
  const { r, g, b, a = 1 } = color;
  return [r / 255, g / 255, b / 255, a * 100];
};

export const _isSamePath = (
  queryPath: Array<number>,
  sourcePath: Array<number>
) => {
  const isRootPath = queryPath.length === 1;
  if (isRootPath) {
    return queryPath[0] === sourcePath[0];
  } else {
    return queryPath.join('') === sourcePath.join('');
  }
};

export const _findLayerAndModify = (
  lottieFile: LottieJSON,
  layerPath: Array<number>,
  modifier: (layer: LottieLayer) => LottieLayer | undefined
): LottieJSON => {
  let leafLayer: LottieLayer | undefined;
  let leafLayerId: number | undefined;
  let assetLayerId: string | undefined;

  layerPath.forEach((path) => {
    if (leafLayer && leafLayer.refId) {
      assetLayerId = leafLayer?.refId;
      leafLayer = lottieFile?.assets
        ?.find((asset) => asset.id === leafLayer?.refId)
        ?.layers?.find((layer) => layer.ind === path);
      leafLayerId = leafLayer?.ind;
    } else {
      leafLayer = lottieFile.layers.find((layer) => layer.ind === path);
      leafLayerId = leafLayer?.ind;
    }
  });

  /* modifying the lottie file */
  if (assetLayerId && lottieFile?.assets) {
    lottieFile.assets = lottieFile.assets.map((asset) => {
      if (asset.id === assetLayerId) {
        asset.layers = asset.layers
          .map((layer) => {
            if (layer.ind === leafLayerId) {
              return modifier(layer);
            }
            return layer;
          })
          .filter((l) => l !== undefined) as LottieLayer[];
      }
      return asset;
    });
  } else {
    lottieFile.layers = lottieFile.layers
      .map((layer) => {
        if (layer.ind === leafLayerId) {
          return modifier(layer);
        }
        return layer;
      })
      .filter((l) => l !== undefined) as LottieLayer[];
  }

  return lottieFile;
};

export const _findShapeAndModify = (
  layer: LottieLayer,
  shapePath: number[] | undefined,
  modifier: (shape: LottieShape) => LottieShape
): LottieLayer => {
  let leafShape: LottieShape | undefined;
  let parentShapeId: number | undefined;
  let shapeId: number | undefined;

  if (!Array.isArray(layer.shapes)) {
    return layer;
  }

  shapePath?.forEach((path) => {
    if (leafShape && leafShape.it) {
      parentShapeId = leafShape.ix;
      leafShape = leafShape.it?.find((shape) => shape.ix === path);
      shapeId = leafShape?.ix;
    } else {
      leafShape = layer?.shapes?.find((shape) => shape.ix === path);
      shapeId = leafShape?.ix;
    }
  });

  if (parentShapeId && layer.shapes) {
    layer.shapes = layer.shapes.map((shape) => {
      if (shape.ix === parentShapeId && shape?.it) {
        shape.it = shape.it.map((s) => {
          if (s.ix === shapeId) {
            return modifier(s);
          }
          return s;
        });
      }
      return shape;
    });
  } else {
    layer.shapes = layer.shapes.map((shape) => {
      debugger;
      if (shape.ix === shapeId) {
        return modifier(shape);
      }
      return shape;
    });
  }

  return layer;
};

export const _getLayerColorMap = (
  layer: LottieLayer,
  layerPath: number[]
): EditorColorMap[] => {
  const colorMaps: EditorColorMap[] = [];
  layer?.shapes?.forEach((shape) => {
    if (
      (shape.ty === 'fl' || shape.ty === 'st') &&
      shape.c &&
      Array.isArray(shape.c.k)
    ) {
      colorMaps.push({
        layerPath: layerPath,
        shapePath: shape.ix ? ([shape.ix] as number[]) : [],
        color: [...shape.c.k?.slice(0, 3), shape.o?.k] as number[],
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
              ...(coloredShape?.c?.k?.slice(0, 3) || []),
              coloredShape.o?.k,
            ] as number[],
          });
        });
    }
  });
  return colorMaps as EditorColorMap[];
};

export const _parseLottie = (
  lottieFile: LottieJSON
): {
  layersMap: EditorLayerMap[];
  colorsMap: EditorColorMap[];
} => {
  const layersMap: EditorLayerMap[] = [];
  const colorsMap: EditorColorMap[] = [];

  lottieFile.layers.forEach((layer) => {
    const nestedAssetLayer =
      layer.refId && Array.isArray(lottieFile.assets)
        ? lottieFile.assets.find((asset) => asset.id === layer.refId)
        : null;

    /* for nested layers */
    if (nestedAssetLayer) {
      layersMap.push({
        path: [layer.ind],
        layerName: layer.nm,
        isVisible: layer.ks.o.k !== 0,
        ind: layer.ind,
        refId: layer.refId,
      });

      /* insert asset layers */
      nestedAssetLayer.layers.forEach((childlayer) => {
        layersMap.push({
          path: [layer.ind, childlayer.ind],
          layerName: childlayer.nm,
          isVisible: childlayer.ks.o.k !== 0,
          ind: childlayer.ind,
          assetId: nestedAssetLayer.id,
          isChild: true,
        });
        /* find color of each layer */
        const layerColorMap = _getLayerColorMap(childlayer, [
          layer.ind,
          childlayer.ind,
        ]);
        colorsMap.push(...layerColorMap);
      });
    } else {
      layersMap.push({
        path: [layer.ind],
        layerName: layer.nm,
        isVisible: layer.ks.o.k !== 0,
        ind: layer.ind,
      });
      const layerColorMap = _getLayerColorMap(layer, [layer.ind]);
      colorsMap.push(...layerColorMap);
    }
  });
  return {
    layersMap,
    colorsMap,
  };
};

export const _toggleLayerVisibility = (
  lottieFile: LottieJSON,
  layerPath: Array<number>
): LottieJSON => {
  const modifier = (layer: LottieLayer): LottieLayer => {
    layer.ks.o.k = layer.ks.o.k !== 0 ? 0 : 100;
    return layer;
  };
  const updatedLottie = _findLayerAndModify(lottieFile, layerPath, modifier);

  return updatedLottie;
};

export const _deleteLayer = (
  lottieFile: LottieJSON,
  layerPath: Array<number>
): LottieJSON => {
  const modifier = (layer: LottieLayer): undefined => undefined;
  const updatedLottie = _findLayerAndModify(lottieFile, layerPath, modifier);
  return updatedLottie;
};

export const _updateLottieColor = (
  lottieFile: LottieJSON,
  updatedColorMap: EditorColorMap
): LottieJSON => {
  const shapeModifier = (shape: LottieShape): LottieShape => {
    if (shape && shape.c) {
      shape.c.k =
        updatedColorMap.color.length > 3
          ? updatedColorMap.color.slice(0, 3)
          : updatedColorMap.color;
      if (shape.o && shape.o.k && updatedColorMap.color.slice(-1)) {
        shape.o.k = updatedColorMap.color.slice(-1)[0];
      }
    }
    return shape;
  };
  const layerModifier = (layer: LottieLayer): LottieLayer => {
    const updatedLayer = _findShapeAndModify(
      layer,
      updatedColorMap.shapePath,
      shapeModifier
    );
    return updatedLayer;
  };
  const updatedLottie = _findLayerAndModify(
    lottieFile,
    updatedColorMap.layerPath,
    layerModifier
  );
  return updatedLottie;
};
