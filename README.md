# ![Glitz](https://github.com/frenic/glitz/raw/master/glitz.svg?sanitize=true)

A tiny [Glitz](https://github.com/frenic/glitz) utility function to be able to pass props to a style function. Any `$`-prefixed props will be emitted and never reach the inner styled component. It's basically an alternative `styled` function that accepts functions that returns a style object as a second argument, which original `styled` doesn't.

```tsx
import { styled } from '@glitz/react';
import withStyleFunction from 'glitz-style-function';

const Link = withStyleFunction(styled.A, props => ({ fontSize: props.$size === 'large' ? '24px' : '18px' }));

const Message = withStyleFunction(
  props => (
    <div className={props.apply()}>
      {props.title}
      {props.children}
      <Link href="/more/info" $size="large">
        More info
      </Link>
    </div>;
  ),
  props => ({ backgroundColor: props.$success ? 'green' : 'red' }),
);

export default () => {
  <Message title="Hurray!" $success>
    The operation was successful
  </Message>;
};
```

Read more at [@glitz/react](https://github.com/frenic/glitz/tree/master/packages/react)!

_Note! This package was primarily created for a easier migration from Styletron to Glitz._
