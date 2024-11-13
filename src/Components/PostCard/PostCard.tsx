import React from 'react';
import { ListElementPostDto } from '../../Dtos/PostDto';
import { Link } from 'react-router-dom';

type PostCardProps = {
    post: ListElementPostDto;
    isAlignedLeft: boolean;
    children?: React.ReactNode;
};

const PostCard: React.FC<PostCardProps> = ({ post, isAlignedLeft, children }) => {
    return (
        <div
            className={`w-3/4 transform transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50 
                        hover:outline hover:outline-2 hover:outline-blue-500 hover:text-blue-500 
                        ${isAlignedLeft ? 'ml-[10%]' : 'mr-[10%]'} my-6 block rounded-lg`}
        >
            <div className="bg-white shadow-lg rounded-lg p-6 relative">
                <Link to={`/post/${post.postId}`} className="block">
                    {post.imageUrl && (
                        <img
                            src={`${process.env.REACT_APP_PITCH_SWITCH_BACKEND_URL}${post.imageUrl}`}
                            alt={post.title}
                            className="w-full h-48 object-cover rounded-md mb-4"
                        />
                    )}
                    <div className="space-y-2">
                        <h2 className="text-2xl font-semibold text-gray-800">{post.title}</h2>
                        <p className="text-gray-600 line-clamp-3">{post.content}</p>
                        <p className="text-sm text-gray-500">
                            By {post.createdByUser.userName} on {new Date(post.createdOn).toLocaleDateString()}
                        </p>
                        {post.isEdited && (
                            <p className="text-xs text-gray-400 italic">(Edited)</p>
                        )}
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default PostCard;
