type LottieShape = {
  ty: string;
  nm?: string;
  ix?: number;
  c?: {
    a: number;
    k: Array<number>;
  };
  o?: {
    a: number;
    k: number;
  };
  it?: Array<LottieShape>;
};

type LottieLayer = {
  ind: number;
  nm: string;
  refId?: string;
  sc?: string;
  ks: {
    /* refers to the opacity of the layer */
    o: {
      a: number;
      k: number;
    };
  };
  shapes?: Array<LottieShape>;
};

type LottieSettings = {
  firstframe: number;
  lastframe: number;
  framerate: number;
  width: number;
  height: number;
};

type LottieJSON = {
  v: string;
  op: number;
  ip: number;
  nm: string;
  fr: number;
  w: number;
  h: number;
  layers: Array<LottieLayer>;
  assets?: Array<{
    nm: string;
    id: string;
    fr: number;
    layers: Array<LottieLayer>;
  }>;
};

type EditorColorMap = {
  shapePath?: Array<number>;
  layerPath: Array<number>;
  color: Array<number>;
};

type EditorLayerMap = {
  path: Array<number>;
  layer: LottieLayer;
  assetLayer?: {
    id: string;
    layers: Array<EditorLayerMap>;
  };
};

type EditorState = {
  lottieFile: LottieJSON;
  layersMap: Array<EditorLayerMap>;
  colorsMap: Array<EditorColorMap>;
  settings: LottieSettings;
};
