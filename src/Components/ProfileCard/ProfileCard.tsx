import React from 'react';

type ProfileCardProps = {
  imageUrl?: string;
  name: string;
  deleteButton?: React.ReactNode;
  updateButton?: React.ReactNode;
};

const ProfileCard: React.FC<ProfileCardProps> = ({ imageUrl, name, deleteButton, updateButton }) => {
  return (
    <div className="w-full flex items-center p-4 bg-white shadow-md rounded-lg">
      {imageUrl &&
        <div className="flex-shrink-0">
        <img
          src={imageUrl}
          alt={name}
          className="w-24 h-24 object-cover rounded-full"
        />
      </div>
      }
      <div className="ml-4 flex flex-col flex-grow">
        <h2 className="text-2xl font-semibold text-gray-800">{name}</h2>
      </div>

      <div className="ml-auto flex space-x-2">
        {updateButton && (
          <div>
            {updateButton}
          </div>
        )}
        {deleteButton && (
          <div>
            {deleteButton}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
