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

import { useEffect, useState, useCallback, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

interface UseUnsavedChangesModalProps {
  hasUnsavedChanges: boolean;
  onSave: () => Promise<void> | void;
}

export function useUnsavedChangesModal({
  hasUnsavedChanges,
  onSave,
}: UseUnsavedChangesModalProps) {
  const history = useHistory();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [pendingLocation, setPendingLocation] = useState<string | null>(null);
  const unblockRef = useRef<(() => void) | null>(null);
  const confirmedRef = useRef(false);

  // Handle browser back/forward and navigation
  useEffect(() => {
    if (hasUnsavedChanges) {
      unblockRef.current = history.block((nextLocation) => {
        // If we've already confirmed, allow navigation
        if (confirmedRef.current) {
          confirmedRef.current = false;
          return true;
        }

        // If navigating to the same location, allow it
        if (nextLocation.pathname === location.pathname) {
          return true;
        }

        // Show modal and store pending location
        setPendingLocation(nextLocation.pathname + nextLocation.search);
        setShowModal(true);
        return false;
      });
    } else {
      // No unsaved changes, remove blocker
      if (unblockRef.current) {
        unblockRef.current();
        unblockRef.current = null;
      }
    }

    return () => {
      if (unblockRef.current) {
        unblockRef.current();
        unblockRef.current = null;
      }
    };
  }, [hasUnsavedChanges, history, location]);

  const handleSave = useCallback(async () => {
    try {
      await onSave();
      setShowModal(false);
      if (pendingLocation) {
        confirmedRef.current = true;
        history.push(pendingLocation);
        setPendingLocation(null);
      }
    } catch (error) {
      // If save fails, keep the modal open
      console.error('Failed to save changes:', error);
    }
  }, [onSave, pendingLocation, history]);

  const handleDiscard = useCallback(() => {
    setShowModal(false);
    if (pendingLocation) {
      confirmedRef.current = true;
      history.push(pendingLocation);
      setPendingLocation(null);
    }
  }, [pendingLocation, history]);

  const handleHide = useCallback(() => {
    setShowModal(false);
    setPendingLocation(null);
  }, []);

  // Handle clicks on navigation links
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href]') as HTMLAnchorElement;

      if (!link) return;

      const href = link.getAttribute('href');
      if (!href) return;

      // Check if it's an internal navigation link
      if (href.startsWith('/') && !href.startsWith('//')) {
        // Prevent default navigation
        e.preventDefault();
        e.stopPropagation();

        // Show modal with pending location
        setPendingLocation(href);
        setShowModal(true);
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [hasUnsavedChanges]);

  return {
    showModal,
    handleSave,
    handleDiscard,
    handleHide,
  };
}