import { render } from '@testing-library/react';

import Lexical from './lexical';

describe('Lexical', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Lexical />);
    expect(baseElement).toBeTruthy();
  });
});
