import React from 'react';
import { Link } from 'react-router-dom';

type Props = {
  title: string;
  subTitle: string;
  imageUrl?: string;
  href?: string;
};

const Tile = ({ title, subTitle, imageUrl, href }: Props) => {
  const content = (
    <div className="relative flex flex-col min-w-0 break-words bg-white rounded-lg shadow-lg h-full">
      <div className="flex-auto p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {imageUrl && (
            <img 
              src={imageUrl} 
              alt={`${title} logo`} 
              className="w-10 h-10 object-cover" 
            />
          )}
          <div>
            <h5 className="text-blueGray-400 uppercase font-bold text-xs">{title}</h5>
            <span className="font-bold text-xl mt-2">{subTitle}</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link 
        to={href} 
        className="w-full p-2 block transform transition-all hover:bg-blue-100 hover:shadow-xl hover:scale-105 hover:text-blue-500"
      >
        {content}
      </Link>
    );
  }

  return <div className="w-full p-2">{content}</div>;
};

export default Tile;
