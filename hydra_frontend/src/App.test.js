import { render, screen } from '@testing-library/react';
import ResetPassword1 from './ResetPassword1';

test('renders learn react link', () => {
  render(<ResetPassword1 />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
