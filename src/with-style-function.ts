import { CSSProp, InnerRefProp, styled, StyledComponent, StyledProps } from '@glitz/react';
import { Style } from '@glitz/type';
import { createElement } from 'react';

export default function withStyleFunction<TInnerProps, TStyleProps>(
  Inner: StyledComponent<TInnerProps>,
  styleFn: (props: TStyleProps) => Style,
) {
  return styled((props: TInnerProps & TStyleProps & StyledProps) => {
    const innerProps = {} as TInnerProps & CSSProp & InnerRefProp;

    for (const key in props) {
      if (key !== 'apply' && key !== 'compose' && key[0] !== '$') {
        innerProps[key as keyof TInnerProps & CSSProp & InnerRefProp] = props[key as keyof TInnerProps];
      }
    }

    innerProps.css = props.compose(styleFn(props));

    return createElement(Inner, innerProps);
  });
}
