import { Input, styled } from 'tamagui'

const StyledInput = styled(Input, {
  borderColor: 'red',
  borderWidth: 5,

  variants: {
    test: {
      true: {
        borderColor: 'green',
        // focusStyle: {
        //   borderWidth: 10,
        //   borderColor: 'blue',
        // },
      },
    },
  },
})

export function StyledInputFocusStyle() {
  return <StyledInput test />
}
