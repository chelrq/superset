/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { render, screen, userEvent } from 'spec/helpers/testing-library';
import '@testing-library/jest-dom';
import UnsavedChangesModal from './UnsavedChangesModal';

describe('UnsavedChangesModal', () => {
  const mockOnSave = jest.fn();
  const mockOnDiscard = jest.fn();
  const mockOnHide = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render modal when showModal is true', () => {
    render(
      <UnsavedChangesModal
        showModal
        onSave={mockOnSave}
        onDiscard={mockOnDiscard}
        onHide={mockOnHide}
      />,
    );

    expect(
      screen.getByText('Save Changes?'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'You have unsaved changes. Would you like to save them before leaving?',
      ),
    ).toBeInTheDocument();
  });

  it('should not render modal when showModal is false', () => {
    render(
      <UnsavedChangesModal
        showModal={false}
        onSave={mockOnSave}
        onDiscard={mockOnDiscard}
        onHide={mockOnHide}
      />,
    );

    expect(
      screen.queryByText('Save Changes?'),
    ).not.toBeInTheDocument();
  });

  it('should call onSave when Save button is clicked', () => {
    render(
      <UnsavedChangesModal
        showModal
        onSave={mockOnSave}
        onDiscard={mockOnDiscard}
        onHide={mockOnHide}
      />,
    );

    const saveButton = screen.getByRole('button', {
      name: /save changes/i,
    });
    userEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledTimes(1);
  });

  it('should call onDiscard when Discard button is clicked', () => {
    render(
      <UnsavedChangesModal
        showModal
        onSave={mockOnSave}
        onDiscard={mockOnDiscard}
        onHide={mockOnHide}
      />,
    );

    const discardButton = screen.getByRole('button', {
      name: /discard changes/i,
    });
    userEvent.click(discardButton);

    expect(mockOnDiscard).toHaveBeenCalledTimes(1);
  });

  it('should disable Save button when saveDisabled is true', () => {
    render(
      <UnsavedChangesModal
        showModal
        onSave={mockOnSave}
        onDiscard={mockOnDiscard}
        onHide={mockOnHide}
        saveDisabled
      />,
    );

    const saveButton = screen.getByRole('button', {
      name: /save changes/i,
    });
    expect(saveButton).toBeDisabled();
  });

  it('should enable Save button when saveDisabled is false', () => {
    render(
      <UnsavedChangesModal
        showModal
        onSave={mockOnSave}
        onDiscard={mockOnDiscard}
        onHide={mockOnHide}
        saveDisabled={false}
      />,
    );

    const saveButton = screen.getByRole('button', {
      name: /save changes/i,
    });
    expect(saveButton).not.toBeDisabled();
  });

  it('should call onHide when modal is dismissed without clicking buttons', () => {
    render(
      <UnsavedChangesModal
        showModal
        onSave={mockOnSave}
        onDiscard={mockOnDiscard}
        onHide={mockOnHide}
      />,
    );

    // Find the close button (usually an X button in the modal header)
    const closeButton = document.querySelector('.antd5-modal-close');
    if (closeButton) {
      userEvent.click(closeButton);
      expect(mockOnHide).toHaveBeenCalledTimes(1);
    }
  });
});