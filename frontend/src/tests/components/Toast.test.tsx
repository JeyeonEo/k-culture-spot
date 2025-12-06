import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Toast from '../../components/Toast';

describe('Toast Component', () => {
  it('renders success toast with message', () => {
    const onClose = vi.fn();
    render(
      <Toast
        id="test-1"
        type="success"
        message="Operation successful"
        onClose={onClose}
      />
    );

    expect(screen.getByText('Operation successful')).toBeInTheDocument();
  });

  it('renders error toast with message', () => {
    const onClose = vi.fn();
    render(
      <Toast
        id="test-2"
        type="error"
        message="An error occurred"
        onClose={onClose}
      />
    );

    expect(screen.getByText('An error occurred')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <Toast
        id="test-3"
        type="info"
        message="Info message"
        onClose={onClose}
        duration={0}
      />
    );

    const closeButton = screen.getByLabelText('Close');
    await user.click(closeButton);

    expect(onClose).toHaveBeenCalledWith('test-3');
  });

  it('auto-closes after duration', async () => {
    vi.useFakeTimers();
    const onClose = vi.fn();

    render(
      <Toast
        id="test-4"
        type="warning"
        message="Warning message"
        onClose={onClose}
        duration={1000}
      />
    );

    expect(onClose).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1000);

    expect(onClose).toHaveBeenCalledWith('test-4');

    vi.useRealTimers();
  });
});
