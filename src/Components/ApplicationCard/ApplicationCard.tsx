import React from 'react';
import { Link } from 'react-router-dom';
import { JournalistStatusApplicationDto } from '../../Dtos/JournalistStatusApplicationDto';

type ApplicationCardProps = {
  application: JournalistStatusApplicationDto;
  updateButton?: React.ReactNode;
  reviewButton?: React.ReactNode;
  deleteButton?: React.ReactNode;
};

const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  updateButton,
  reviewButton,
  deleteButton,
}) => {
  const status = application.isAccepted
    ? 'Accepted'
    : application.isReviewed
    ? 'Rejected'
    : 'Pending';

  const statusStyles: Record<typeof status, string> = {
    Pending: 'bg-yellow-500 text-yellow-100',
    Accepted: 'bg-green-500 text-green-100',
    Rejected: 'bg-red-500 text-red-100',
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-white shadow-lg rounded-lg p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-700">Application</h3>
        <span
          className={`text-sm font-semibold px-2 py-1 rounded ${statusStyles[status]}`}
        >
          {status}
        </span>
      </div>

      <p className="text-gray-800 text-sm">{application.motivation}</p>

      <p className="text-sm text-gray-600">
        <strong>Submitted on:</strong> {new Date(application.createdOn).toLocaleDateString()}
      </p>

      <div className="flex items-center space-x-2">
        <img
          src={application.submittedByUser.profilePictureUrl ? `${process.env.REACT_APP_PITCH_SWITCH_BACKEND_URL}${application.submittedByUser.profilePictureUrl}` : '/images/default_user_picture.png'}
          alt={application.submittedByUser.userName}
          className="w-10 h-10 object-cover rounded-full"
        />
        <div>
          <Link
            to={`/user/${application.submittedByUser.userId}`}
            className="text-sm font-semibold text-blue-500 hover:text-blue-700"
          >
            {application.submittedByUser.userName}
          </Link>
        </div>
      </div>

      {application.isReviewed && application.reviewedOn && (
        <div className="text-sm text-gray-600">
          <strong>Reviewed on:</strong> {new Date(application.reviewedOn).toLocaleDateString()}
        </div>
      )}

      {application.isReviewed && application.rejectionReason && (
        <div className="text-sm text-red-600 mt-2">
          <strong>Rejection Reason:</strong> {application.rejectionReason}
        </div>
      )}

      <div className="mt-4 flex space-x-2">
        {updateButton && (
          <div className="inline-block">
            {updateButton}
          </div>
        )}
        {reviewButton && (
          <div className="inline-block">
            {reviewButton}
          </div>
        )}
        {deleteButton && (
          <div className="inline-block">
            {deleteButton}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationCard;
