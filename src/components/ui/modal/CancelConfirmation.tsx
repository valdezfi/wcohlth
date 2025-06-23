"use client";
import React from "react";
import { Modal } from "./index";
import Button from "../button/Button";

interface CancelConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function CancelConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
}: CancelConfirmationProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 max-w-md">
        <h2 className="text-lg font-semibold mb-2">Cancel Transaction?</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Are you sure you want to cancel this approved transaction? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            No, Keep It
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Yes, Cancel It
          </Button>
        </div>
      </div>
    </Modal>
  );
}
