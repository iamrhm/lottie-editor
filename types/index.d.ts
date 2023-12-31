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

type LottieAssets = {
  nm: string;
  id: string;
  fr: number;
  layers: Array<LottieLayer>;
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
  assets?: Array<LottieAssets>;
};

type EditorColorMap = {
  shapePath?: Array<number>;
  layerPath: Array<number>;
  color: Array<number>;
};

type EditorLayerMap = {
  path: Array<number>;
  layerName: string;
  refId?: string;
  ind: number;

  isVisible: boolean;
  /* only for nested layers */
  isChild?: boolean;
  assetId?: string;
};

type EditorState = {
  lottieFile: LottieJSON | null;
  layersMap: Array<EditorLayerMap>;
  colorsMap: Array<EditorColorMap>;
  settings: LottieSettings | null;
  selectedLayer: number[];
};

type ProfileState = {
  userId: string | null;
  userName: string | null;
};

type LayerVisibility = {
  type: 'LayerVisibility';
  data: { layerPath: number[]; roomId: string };
};

type DeleteLayer = {
  type: 'DeleteLayer';
  data: { layerPath: number[]; roomId: string };
};

type UpdateColor = {
  type: 'UpdateColor';
  data: { updatedColorMap: EditorColorMap; roomId: string };
};

type UpdateSettings = {
  type: 'UpdateSettings';
  data: { settings: LottieSettings; roomId: string };
};

type UpdateUniqueColors = {
  type: 'UpdateUniqueColors';
  data: { colorsMap: EditorColorMap[]; roomId: string };
};

type UserJoined = {
  type: 'UserJoined';
  data: {
    userName: string;
    userId: string;
    roomId: string;
  };
};

type UserLeft = {
  type: 'UserLeft';
  data: { userId: string; roomId: string };
};

type ActiveUser = {
  type: 'ActiveUser';
  data: { users: Array<ProfileState>; roomId: string };
};

interface SessionDetails {
  roomId: string | null;
  users: Array<ProfileState>;
}

type Action =
  | LayerVisibility
  | DeleteLayer
  | UpdateColor
  | UpdateSettings
  | UserJoined
  | UserLeft
  | ActiveUser
  | UpdateUniqueColors;

type Message = {
  message: string;
  profile: ProfileState;
};
