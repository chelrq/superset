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

import { t } from '@superset-ui/core';
import Modal from 'src/components/Modal';
import Button from 'src/components/Button';

export interface UnsavedChangesModalProps {
  showModal: boolean;
  onSave: () => void;
  onDiscard: () => void;
  onHide: () => void;
  saveDisabled?: boolean;
}

function UnsavedChangesModal({
  showModal,
  onSave,
  onDiscard,
  onHide,
  saveDisabled = false,
}: UnsavedChangesModalProps) {
  const footer = (
    <>
      <Button key="discard" buttonStyle="secondary" onClick={onDiscard}>
        {t('Discard changes')}
      </Button>
      <Button
        key="save"
        buttonStyle="primary"
        onClick={onSave}
        disabled={saveDisabled}
      >
        {t('Save changes')}
      </Button>
    </>
  );

  return (
    <Modal
      show={showModal}
      onHide={onHide}
      title={t('Save Changes?')}
      footer={footer}
      hideFooter={false}
      centered
    >
      <p>
        {t(
          'You have unsaved changes. Would you like to save them before leaving?',
        )}
      </p>
    </Modal>
  );
}

export default UnsavedChangesModal;