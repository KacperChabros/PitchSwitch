import React from 'react';
import { FaPen, FaTrash, FaArchive, FaUndo, FaPlus, FaCheckCircle  } from 'react-icons/fa';

type DeleteButtonProps = {
  onClick: () => void;
  label?: string;
};

const DeleteButton: React.FC<DeleteButtonProps> = ({ onClick, label = "Delete" }) => (
  <button
    onClick={onClick}
    className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 flex items-center space-x-2"
  >
    <FaTrash />
    <span>{label}</span>
  </button>
);

type UpdateButtonProps = {
  onClick: () => void;
  label?: string;
};

const UpdateButton: React.FC<UpdateButtonProps> = ({ onClick, label = "Update" }) => (
  <button
    onClick={onClick}
    className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 flex items-center space-x-2"
  >
    <FaPen />
    <span>{label}</span>
  </button>
);

type ArchiveButtonProps = {
    onClick: () => void;
    label?: string;
  };
  
  const ArchiveButton: React.FC<ArchiveButtonProps> = ({ onClick, label = "Archive" }) => (
    <button
      onClick={onClick}
      className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600 flex items-center space-x-1"
    >
      <FaArchive />
      <span>{label}</span>
    </button>
  );

type RestoreButtonProps = {
  onClick: () => void;
  label?: string;
};

const RestoreButton: React.FC<RestoreButtonProps> = ({ onClick, label = "Restore" }) => (
  <button
    onClick={onClick}
    className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 flex items-center space-x-1"
  >
    <FaUndo />
    <span>{label}</span>
  </button>
);

type AddButtonProps = {
  onClick: () => void;
  label?: string;
};

const AddButton: React.FC<AddButtonProps> = ({ onClick, label = "Add" }) => (
  <button
    onClick={onClick}
    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none flex items-center space-x-2"
  >
    <FaPlus />
    <span>{label}</span>
  </button>
);

type ReviewButtonProps = {
  onClick: () => void;
  label?: string;
};

const ReviewButton: React.FC<ReviewButtonProps> = ({ onClick, label = "Review" }) => (
  <button
    onClick={onClick}
    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none flex items-center space-x-2"
  >
    <FaCheckCircle />
    <span>{label}</span>
  </button>
);

export { RestoreButton, UpdateButton, ArchiveButton, AddButton, DeleteButton, ReviewButton };
