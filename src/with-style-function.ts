import {
  createRenderer,
  ExternalProps,
  StyledComponent,
  StyledElementLike,
  StyledElementProps,
  StyledProps,
  WithInnerRefProp,
} from '@glitz/react';
import { Style, StyleArray, StyleOrStyleArray } from '@glitz/type';
import * as React from 'react';

export type StyleFunction<TStyleProps> = (props: TStyleProps) => Style;

export default function withStyleFunction<TProps, TStyleProps>(
  component: StyledComponent<TProps>,
  style: StyleFunction<TStyleProps>,
): StyledWithFunctionComponent<TProps, TStyleProps>;

export default function withStyleFunction<TProps extends StyledElementProps, TStyleProps>(
  component: StyledElementLike<React.StatelessComponent<TProps>>,
  style: StyleFunction<TStyleProps>,
): StyledWithFunctionComponent<TProps, TStyleProps>;

export default function withStyleFunction<
  TProps extends StyledElementProps,
  TStyleProps,
  TInstance extends React.Component<TProps, React.ComponentState>
>(
  component: StyledElementLike<React.ClassType<TProps, TInstance, React.ComponentClass<TProps>>>,
  style: StyleFunction<TStyleProps>,
): StyledWithFunctionComponent<WithInnerRefProp<TProps, TInstance>, TStyleProps>;

export default function withStyleFunction<TProps extends StyledProps, TStyleProps>(
  component: React.StatelessComponent<TProps>,
  style: StyleFunction<TStyleProps>,
): StyledWithFunctionComponent<TProps, TStyleProps>;

export default function withStyleFunction<
  TProps extends StyledProps,
  TStyleProps,
  TInstance extends React.Component<TProps, React.ComponentState>
>(
  component: React.ClassType<TProps, TInstance, React.ComponentClass<TProps>>,
  style: StyleFunction<TStyleProps>,
): StyledWithFunctionComponent<WithInnerRefProp<TProps, TInstance>, TStyleProps>;

export default function withStyleFunction<TProps, TStyleProps>(
  type:
    | StyledElementLike<React.ComponentType<TProps>>
    | StyledWithFunctionComponent<TProps, TStyleProps>
    | React.ComponentType<TProps>,
  style: StyleFunction<TStyleProps>,
): StyledWithFunctionComponent<TProps, TStyleProps> {
  return isStyledWithStyleFunction<TProps, TStyleProps>(type)
    ? type.compose([style])
    : factory<TProps, TStyleProps>(type, [style]);
}

interface StyledWithFunctionComponent<TProps, TStyleProps> extends StyledComponent<TProps & TStyleProps> {
  compose<TMoreStyleProps>(
    style?: Array<Style | StyleFunction<TMoreStyleProps>>,
  ): StyledWithFunctionComponent<TProps, TStyleProps & TMoreStyleProps>;
}

class StyledWithFunctionSuper<TProps, TStyleProps> extends React.Component<ExternalProps<TProps & TStyleProps>> {}

function factory<TProps, TStyleProps>(
  type: StyledElementLike<React.ComponentType<TProps>> | React.ComponentType<TProps>,
  styles: Array<Style | StyleFunction<TStyleProps>>,
): StyledWithFunctionComponent<TProps, TStyleProps> {
  // tslint:disable-next-line max-classes-per-file
  return class StyledWithFunction extends StyledWithFunctionSuper<TProps, TStyleProps> {
    public static compose<TMoreStyleProps>(additionals?: Array<Style | StyleFunction<TMoreStyleProps>>) {
      return factory<TProps, TStyleProps & TMoreStyleProps>(
        type,
        additionals ? (styles as Array<Style | StyleFunction<any>>).concat(additionals) : styles,
      );
    }
    constructor(props: ExternalProps<TProps & TStyleProps>) {
      super(props);

      const renderWithProps = createRenderer(type);

      this.render = () => {
        const currentProps = this.props as any;
        const innerProps = {} as ExternalProps<TProps>;
        let additional: StyleOrStyleArray | undefined = innerProps.css;

        let key: string;
        for (key in currentProps) {
          if (key === 'compose' && typeof currentProps[key] === 'function') {
            additional = currentProps[key](innerProps.css);
            continue;
          }

          if (key === 'apply' && typeof currentProps[key] === 'function') {
            continue;
          }

          if (key[0] !== '$') {
            innerProps[key as keyof ExternalProps<TProps>] = currentProps[key] as any;
          }
        }

        const result: StyleArray = [];
        for (const style of styles) {
          result.push(typeof style === 'function' ? style(currentProps) : style);
        }

        innerProps.css = additional ? result.concat(additional) : result;

        return renderWithProps(innerProps);
      };
    }
  };
}

export function isStyledWithStyleFunction<TProps, TStyleProps>(
  type: any,
): type is StyledWithFunctionComponent<TProps, TStyleProps> {
  return typeof type === 'function' && type.prototype instanceof StyledWithFunctionSuper;
}
