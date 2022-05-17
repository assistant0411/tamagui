import '@tamagui/core/reset.css'
import '@tamagui/polyfill-dev'

import { Slider } from '@tamagui/slider'
import React, { useState } from 'react'
import {
  Button,
  Paragraph,
  Popover,
  PopoverProps,
  Tooltip,
  TooltipGroup,
  TooltipProps,
  XStack,
  YStack,
} from 'tamagui'

import Tamagui from './tamagui.config'

React['keep']

export const Sandbox = () => {
  const [theme, setTheme] = useState('light' as any)
  return (
    <Tamagui.Provider disableRootThemeClass injectCSS defaultTheme={theme}>
      <Button
        pos="absolute"
        b={10}
        l={10}
        onPress={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        Switch
      </Button>

      <div
        style={{
          width: '100%',
          height: '100%',
          pointerEvents: 'auto',
          display: 'flex',
          flexDirection: 'column',
          background: 'red',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Demo />
      </div>
    </Tamagui.Provider>
  )
}

export function Demo(props: Omit<PopoverProps, 'children'>) {
  return (
    <Slider>
      <Slider.Track>
        <Slider.Thumb index={0} />
      </Slider.Track>
    </Slider>
  )
}
