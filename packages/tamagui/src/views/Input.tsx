import { GetProps, setupReactNative, styled } from '@tamagui/core'
import { focusableInputHOC } from '@tamagui/focusable'
import { TextInput } from 'react-native'

import { inputSizeVariant } from '../helpers/inputHelpers'

setupReactNative({
  TextInput,
})

export const InputFrame = styled(
  TextInput,
  {
    name: 'Input',

    variants: {
      unstyled: {
        false: {
          size: '$true',
          fontFamily: '$body',
          borderWidth: 1,
          outlineWidth: 0,
          color: '$color',
          focusable: true,
          borderColor: '$borderColor',
          backgroundColor: '$background',
          placeholderTextColor: '$placeholderColor',

          // this fixes a flex bug where it overflows container
          minWidth: 0,

          hoverStyle: {
            borderColor: '$borderColorHover',
          },

          focusStyle: {
            borderColor: '$borderColorFocus',
            borderWidth: 2,
            marginHorizontal: -1,
          },
        },
      },

      size: {
        '...size': inputSizeVariant,
      },
    } as const,

    defaultVariants: {
      unstyled: false,
    },
  },
  {
    isInput: true,
  }
)

export type InputProps = GetProps<typeof InputFrame>

export const Input = focusableInputHOC(InputFrame)
