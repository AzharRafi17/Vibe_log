"use client"

import { Trash2 } from "lucide-react"

interface DeleteConfirmationDialogProps {
    onDelete: () => void;
    onCancel: () => void;
}

export default function DeleteConfirmationDialog({ onDelete, onCancel }: DeleteConfirmationDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95 duration-300">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
            <Trash2 className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">Delete Affirmation?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This action cannot be undone. Are you sure you want to delete this vibe?
          </p>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-3 rounded-2xl font-semibold bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={onDelete}
              className="flex-1 py-3 rounded-2xl font-semibold bg-red-600 text-white hover:bg-red-700 transition-all shadow-lg hover:shadow-red-500/50"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}