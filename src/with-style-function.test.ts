import { GlitzClient } from '@glitz/core';
import { GlitzProvider, styled, StyledProps } from '@glitz/react';
import * as React from 'react';
import * as renderer from 'react-test-renderer';
import withStyleFunction from './with-style-function';

describe('styled with style function', () => {
  it('styles with custom styled component', () => {
    const StyledComponent = withStyleFunction(
      props => {
        expect(props.apply()).toBe('a');
        expect(props.compose()).toEqual([{ color: 'red' }]);
        return React.createElement('div');
      },
      () => ({ color: 'red' }),
    );

    renderer.create(
      React.createElement(
        GlitzProvider,
        {
          glitz: new GlitzClient(),
        },
        React.createElement(StyledComponent),
      ),
    );
  });
  it('composes styled with function', () => {
    const StyledComponent = withStyleFunction(
      props => {
        expect(props.apply()).toBe('a b');
        expect(props.compose()).toEqual([{ color: 'red' }, { backgroundColor: 'red' }]);
        return React.createElement('div');
      },
      () => ({ color: 'red' }),
    );

    const ComposedComponent = withStyleFunction(StyledComponent, () => ({ backgroundColor: 'red' }));

    renderer.create(
      React.createElement(
        GlitzProvider,
        {
          glitz: new GlitzClient(),
        },
        React.createElement(ComposedComponent),
      ),
    );
  });
  it('composes styled without function', () => {
    const StyledComponent = styled(
      props => {
        expect(props.apply()).toBe('a b');
        expect(props.compose()).toEqual([{ color: 'red' }, { backgroundColor: 'red' }]);
        return React.createElement('div');
      },
      { color: 'red' },
    );

    const ComposedComponent = withStyleFunction(StyledComponent, () => ({ backgroundColor: 'red' }));

    renderer.create(
      React.createElement(
        GlitzProvider,
        {
          glitz: new GlitzClient(),
        },
        React.createElement(ComposedComponent),
      ),
    );
  });
  it('styles with predefined styled component', () => {
    const StyledComponent = withStyleFunction(styled.Div, () => ({ color: 'red' }));

    const component = renderer.create(
      React.createElement(
        GlitzProvider,
        {
          glitz: new GlitzClient(),
        },
        React.createElement(StyledComponent),
      ),
    );

    expect(component).toMatchSnapshot();
  });
  it('pass props to style function', () => {
    const StyledComponent = withStyleFunction(
      styled.Div,
      ({ apply, compose, ...props }: { prop: string; $prop: string } & StyledProps) => {
        expect(props).toEqual({ prop: '', $prop: '' });
        return {};
      },
    );

    renderer.create(
      React.createElement(
        GlitzProvider,
        {
          glitz: new GlitzClient(),
        },
        React.createElement(StyledComponent, { prop: '', $prop: '' }),
      ),
    );
  });
  it('emits props prefixed with `$`', () => {
    const StyledComponent = withStyleFunction(
      styled(({ apply, compose, ...props }: { prop: string; $prop: string } & StyledProps) => {
        expect(props).toEqual({ prop: '' });
        return React.createElement('div');
      }),
      () => ({}),
    );

    renderer.create(
      React.createElement(
        GlitzProvider,
        {
          glitz: new GlitzClient(),
        },
        React.createElement(StyledComponent, { prop: '', $prop: '' }),
      ),
    );
  });
});
