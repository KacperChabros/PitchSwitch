import React from 'react';

type Props = {
  title: string;
  subTitle: string;
};

const Tile = ({ title, subTitle }: Props) => {
  return (
    <div className="w-full p-2">
      <div className="relative flex flex-col min-w-0 break-words bg-white rounded-lg shadow-lg h-full">
        <div className="flex-auto p-4 flex flex-col justify-between">
          <h5 className="text-blueGray-400 uppercase font-bold text-xs">{title}</h5>
          <span className="font-bold text-xl mt-2">{subTitle}</span>
        </div>
      </div>
    </div>

  );
};

export default Tile;
