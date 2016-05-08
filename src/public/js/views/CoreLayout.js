import React from 'react';

function CoreLayout({ children }) {
  return (
    <div className="page-container clearfix">
      <div className="view-container">
        {children}
      </div>
    </div>
  );
}

CoreLayout.propTypes = {
  children: React.PropTypes.element,
};

export default CoreLayout;
