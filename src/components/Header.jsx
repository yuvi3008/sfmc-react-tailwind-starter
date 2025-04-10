import React from 'react';

function Header({heading, content}) {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">
       {heading}
      </h2>
      <p className="mb-6 text-gray-600">
        {content}
      </p>
    </div>
  );
}

export default Header;
