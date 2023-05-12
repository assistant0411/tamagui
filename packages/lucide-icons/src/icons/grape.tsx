import PropTypes from 'prop-types'
import React, { memo } from 'react'
import {
  Defs,
  Ellipse,
  G,
  Line,
  LinearGradient,
  Path,
  Polygon,
  Polyline,
  RadialGradient,
  Rect,
  Stop,
  Svg,
  Symbol,
  Use,
  Circle as _Circle,
  Text as _Text,
} from 'react-native-svg'

import { IconProps } from '../IconProps'
import { themed } from '../themed'

const Icon = (props) => {
  const { color = 'black', size = 24, ...otherProps } = props
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={`${color}`}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...otherProps}
    >
      <Path d="M22 5V2l-5.89 5.89" stroke={`${color}`} />
      <_Circle cx="16.6" cy="15.89" r="3" stroke={`${color}`} />
      <_Circle cx="8.11" cy="7.4" r="3" stroke={`${color}`} />
      <_Circle cx="12.35" cy="11.65" r="3" stroke={`${color}`} />
      <_Circle cx="13.91" cy="5.85" r="3" stroke={`${color}`} />
      <_Circle cx="18.15" cy="10.09" r="3" stroke={`${color}`} />
      <_Circle cx="6.56" cy="13.2" r="3" stroke={`${color}`} />
      <_Circle cx="10.8" cy="17.44" r="3" stroke={`${color}`} />
      <_Circle cx="5" cy="19" r="3" stroke={`${color}`} />
    </Svg>
  )
}

Icon.displayName = 'Grape'

export const Grape = memo<IconProps>(themed(Icon))
