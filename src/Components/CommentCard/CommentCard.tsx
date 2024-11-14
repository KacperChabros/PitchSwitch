import React from 'react';
import { MinimalCommentDto } from '../../Dtos/Comment';
import { Link } from 'react-router-dom';

type CommentCardProps = {
  comment: MinimalCommentDto;
  updateButton?: React.ReactNode;
  deleteButton?: React.ReactNode;
  canUpdateAndDelete?: boolean;
};

const CommentCard: React.FC<CommentCardProps> = ({ comment, updateButton, deleteButton, canUpdateAndDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex items-center justify-between">
        <Link to={`user/${comment.createdByUser.userName}`} className="hover:bg-blue-300">
          <div className="flex items-center">
            <img 
              src={comment.createdByUser.profilePictureUrl ? `${process.env.REACT_APP_PITCH_SWITCH_BACKEND_URL}${comment.createdByUser.profilePictureUrl}` 
              : "/images/default_user_picture.png"} 
              alt={comment.createdByUser.userName} 
              className="w-10 h-10 rounded-full mr-4"
            />
            <span className="font-bold">{comment.createdByUser.userName}</span>
          </div>
        </Link>
        
        {canUpdateAndDelete && (
          <div className="flex space-x-2">
            {updateButton && <div>{updateButton}</div>}
            {deleteButton && <div>{deleteButton}</div>}
          </div>
        )}
      </div>
      <p className="text-gray-800 mt-2">{comment.content}</p>
      <div className="text-sm text-gray-500 mt-1">
        {new Date(comment.createdOn).toLocaleDateString()} {comment.isEdited && <span className="italic">(edited)</span>}
      </div>
    </div>
  );
};

export default CommentCard;
