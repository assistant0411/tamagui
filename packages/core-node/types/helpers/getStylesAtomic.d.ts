import { StyleObject } from '@tamagui/helpers';
import { ViewStyle } from 'react-native';
export declare type ViewStyleWithPseudos = ViewStyle & {
    hoverStyle?: ViewStyle;
    pressStyle?: ViewStyle;
    focusStyle?: ViewStyle;
};
declare type AtomicStyleOptions = {
    splitTransforms?: boolean;
};
export declare const psuedoCNInverse: {
    hover: string;
    focus: string;
    press: string;
};
export declare function getStylesAtomic(stylesIn: ViewStyleWithPseudos, options?: AtomicStyleOptions): StyleObject[];
export {};
//# sourceMappingURL=getStylesAtomic.d.ts.map