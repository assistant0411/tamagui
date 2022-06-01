// import { AccessibleIcon } from '@tamagui/feather-icons'
import { Minus } from '@tamagui/feather-icons'
import React from 'react'
import {
  H4,
  ListItem,
  Paragraph,
  Separator,
  Text,
  Theme,
  ThemeInverse,
  ThemeReset,
  XStack,
  YStack,
  styled,
} from 'tamagui'

import { Code } from './Code'

type PropDef = {
  name: string
  required?: boolean
  default?: string | boolean
  type: string
  description?: string
}

export function PropsTable({
  data,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: {
  data: PropDef[]
  'aria-label'?: string
  'aria-labelledby'?: string
}) {
  const hasAriaLabel = !!(ariaLabel || ariaLabelledBy)
  return (
    <YStack
      borderWidth={1}
      borderColor="$borderColor"
      f={1}
      aria-label={hasAriaLabel ? ariaLabel : 'Component Props'}
      aria-labelledby={ariaLabelledBy}
      my="$4"
      br="$4"
      mx="$-4"
      $sm={{
        mx: 0,
      }}
    >
      {data.map(({ name, type, required, default: defaultValue, description }, i) => (
        <ListItem key={`${name}-${i}`} p={0}>
          <YStack width="100%">
            <XStack py="$3" px="$4" backgroundColor="$background" $sm={{ flexDirection: 'column' }}>
              <XStack miw="30%" ai="center" space>
                <H4
                  color="$color"
                  fow="800"
                  fontFamily="$mono"
                  textTransform="none"
                  size="$5"
                  width={200}
                >
                  {name}
                  {required ? (
                    <Paragraph tag="span" fontSize="inherit" o={0.5}>
                      {' '}
                      <Paragraph tag="span" fontWeight="800" theme="yellow">
                        (required)
                      </Paragraph>
                    </Paragraph>
                  ) : null}
                </H4>
              </XStack>

              <Separator als="stretch" vertical mx="$4" my="$2" />

              <XStack
                f={2}
                miw="30%"
                ai="center"
                separator={<Separator als="stretch" vertical mx="$4" my="$2" />}
                $xs={{
                  flexDirection: 'column',
                  ai: 'flex-start',
                }}
              >
                <Paragraph size="$3" o={0.8} fontFamily="$mono" overflow="hidden" ellipse mr="auto">
                  {type}
                </Paragraph>

                <XStack ai="center">
                  <Paragraph o={0.5} size="$2">
                    Default:&nbsp;
                  </Paragraph>
                  {Boolean(defaultValue) ? (
                    <Code bc="$backgroundPress">{defaultValue}</Code>
                  ) : (
                    <YStack>
                      <Minus size={12} opacity={0.5} color="var(--color)" />
                    </YStack>
                  )}
                </XStack>
              </XStack>
            </XStack>

            {description && (
              <YStack py="$2" px="$4">
                <Paragraph size="$2" o={0.65}>
                  {description}
                </Paragraph>
              </YStack>
            )}
          </YStack>
          <Separator my={2} />
        </ListItem>
      ))}
    </YStack>
  )
}

const TD = styled(XStack, {
  // @ts-ignore
  display: 'table-cell',
  tag: 'td',
  paddingTop: 10,
})
