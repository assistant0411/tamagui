import { getConfig } from '../conf'
import { isWeb } from '../constants/platform'
import { Variable, isVariable } from '../createVariable'
import { StaticConfig, TamaguiInternalConfig } from '../types'
import { isObj } from './isObj'

export type ResolveVariableTypes = 'auto' | 'value' | 'variable'

export const createPropMapper = (c: StaticConfig) => {
  const variants = c.variants
  let variantsParsed
  const defaultProps = c.defaultProps || {}

  return (
    key: string,
    value: any,
    theme: any,
    props: any,
    staticConfig: StaticConfig,
    returnVariablesAs: ResolveVariableTypes = !!props.animation ? 'value' : 'auto',
    avoidDefaultProps = false
  ) => {
    const conf = getConfig()
    if (!conf) {
      console.trace('no conf! err')
      return
    }
    if (variants && !variantsParsed) {
      variantsParsed = parseVariants(variants, conf)
    }

    // handled here because we need to resolve this off tokens, its the only one-off like this
    let fontFamily = props.fontFamily || defaultProps.fontFamily || '$body'

    // expand variants
    const variant = variantsParsed && variantsParsed[key]
    if (variant && typeof value !== 'undefined') {
      let variantValue =
        variant[value] ||
        (value === true
          ? variant['true'] || variant[':boolean']
          : value === false
          ? variant['false'] || variant[':boolean']
          : variant[value])

      if (!variantValue) {
        if (variant[':number'] && !isNaN(value)) {
          variantValue = variant[':number']
        } else if (variant[':string'] && typeof value === 'string') {
          variantValue = variant[':string']
        } else {
          variantValue = variant['...']
        }
      }

      if (!variantValue) {
        return value
      }

      if (typeof variantValue === 'function') {
        variantValue = variantValue(value, {
          tokens: conf.tokensParsed,
          theme,
          // we avoid passing in default props for media queries because that would confuse things like SizableText.size:
          props: avoidDefaultProps
            ? props
            : new Proxy(props, {
                get(target, key) {
                  if (Reflect.has(target, key)) {
                    return Reflect.get(target, key)
                  }
                  // these props may be extracted into classNames, but we still want to access them
                  // at runtime, so we proxy back to defaultProps but don't pass them
                  if (staticConfig.defaultProps) {
                    return Reflect.get(staticConfig.defaultProps, key)
                  }
                },
              }),
        })
      }
      if (isObj(variantValue)) {
        variantValue = resolveTokens(variantValue, conf, theme, fontFamily, returnVariablesAs)
      }
      return variantValue
    }

    let shouldReturn = false

    // handle shorthands
    if (conf.shorthands[key]) {
      shouldReturn = true
      key = conf.shorthands[key]
    }

    if (value) {
      shouldReturn = true
      if (value[0] === '$') {
        value = getToken(key, value, conf, theme, fontFamily, returnVariablesAs)
      } else if (isVariable(value)) {
        value = getVariableValue(value, returnVariablesAs)
      }
    }

    if (shouldReturn) {
      return {
        [key]: value,
      }
    }
  }
}

const resolveTokens = (
  input: Object,
  conf: TamaguiInternalConfig,
  theme: any,
  fontFamily: any,
  resolveAs?: ResolveVariableTypes
) => {
  let res = {}
  for (const rKey in input) {
    const fKey = conf.shorthands[rKey] || rKey
    const val = input[rKey]
    if (isVariable(val)) {
      res[fKey] =
        resolveAs === 'variable' ? val : !isWeb || resolveAs === 'value' ? val.val : val.variable
    } else if (typeof val === 'string') {
      const fVal = val[0] === '$' ? getToken(fKey, val, conf, theme, fontFamily, resolveAs) : val
      res[fKey] = fVal
    } else {
      if (isObj(val)) {
        // for things like shadowOffset, hoverStyle which is a sub-object
        res[fKey] = resolveTokens(val, conf, theme, fontFamily, resolveAs)
      } else {
        // nullish values cant be tokens so need no exrta parsing
        res[fKey] = input[fKey]
      }
    }
    if (process.env.NODE_ENV === 'development') {
      if (res[fKey]?.[0] === '$') {
        console.warn(`⚠️ Missing token in theme ${theme.name}:`, fKey, res[fKey])
      }
    }
  }
  return res
}

const getToken = (
  key: string,
  value: string,
  { tokensParsed }: TamaguiInternalConfig,
  theme: any,
  fontFamily: string | undefined = '$body',
  resolveAs?: ResolveVariableTypes
) => {
  let valOrVar: any
  let hasSet = false
  const valueName = value[0] === '$' ? value.slice(1) : value
  if (valueName in theme) {
    valOrVar = theme[valueName]
    hasSet = true
  } else {
    switch (key) {
      case 'fontFamily':
        valOrVar = tokensParsed.font[value]?.family || value
        hasSet = true
        break
      case 'fontSize':
        valOrVar = tokensParsed.font[fontFamily]?.size[value] || value
        hasSet = true
        break
      case 'lineHeight':
        valOrVar = tokensParsed.font[fontFamily]?.lineHeight[value] || value
        hasSet = true
        break
      case 'letterSpacing':
        valOrVar = tokensParsed.font[fontFamily]?.letterSpacing[value] || value
        hasSet = true
        break
      case 'fontWeight':
        valOrVar = tokensParsed.font[fontFamily]?.weight[value] || value
        hasSet = true
        break
    }
    for (const cat in tokenCategories) {
      if (key in tokenCategories[cat]) {
        const res = tokensParsed[cat][value]
        if (res) {
          valOrVar = res
          hasSet = true
        }
      }
    }
    if (!hasSet) {
      const spaceVar = tokensParsed.space[value]
      if (spaceVar) {
        valOrVar = spaceVar
        hasSet = true
      }
    }
  }
  if (hasSet) {
    return getVariableValue(valOrVar, resolveAs)
  }
  if (process.env.NODE_ENV === 'development') {
    if (value && value[0] === '$') {
      console.warn(`⚠️ Missing token in theme:`, value, theme)
      return null
    }
  }
  return value
}

function getVariableValue(valOrVar: Variable | any, resolveAs: ResolveVariableTypes = 'auto') {
  if (isVariable(valOrVar)) {
    if (resolveAs === 'variable') {
      return valOrVar
    }
    if (!isWeb || resolveAs === 'value') {
      return valOrVar.val
    }
    return valOrVar.variable
  }
  return valOrVar
}

// just specificy the least costly, all else go to `space` (most keys - we can exclude)
const tokenCategories = {
  radius: {
    borderRadius: true,
  },
  size: {
    width: true,
    height: true,
    minWidth: true,
    minHeight: true,
    maxWidth: true,
    maxHeight: true,
  },
  color: {
    color: true,
    backgroundColor: true,
    borderColor: true,
    borderBottomColor: true,
    borderTopColor: true,
    borderLeftColor: true,
    borderRightColor: true,
  },
}

// turns variant spreads into individual lookups
function parseVariants(variants: any, conf: TamaguiInternalConfig) {
  return Object.keys(variants).reduce((acc, key) => {
    acc[key] = Object.keys(variants[key]).reduce((vacc, vkey) => {
      const variantVal = variants[key][vkey]
      if (vkey.startsWith('...')) {
        // set the default one at '...' for easy fallback on non-exact-variant-match
        vacc['...'] = variantVal
        const tokenKey = vkey.slice(3)
        const tokens = conf.tokens[tokenKey]
        for (const tkey in tokens) {
          vacc[`$${tkey}`] = variantVal
        }
      } else {
        vacc[vkey] = variantVal
      }
      return vacc
    }, {})
    return acc
  }, {})
}
