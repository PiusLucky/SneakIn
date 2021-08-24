import React from "react";
import ContentLoader from 'react-content-loader'

const loader_duplicator = (numb) => {
  const loaders = []
  for (let i = 0; i < numb; i++) {
     loaders.push(
     <ContentLoader
       height={54}
       width={320}
       viewBox="0 0 320 54"
       style={{ width: '100%' }}
       key={i}
     >
     <circle cx="27" cy="27" r="18" />
     <rect x="53" y="14" rx="3" ry="3" width="180" height="13" />
     <rect x="53" y="30" rx="3" ry="3" width="10" height="10" />
     <rect x="67" y="30" rx="3" ry="3" width="74" height="10" />
     <circle cx="305" cy="27" r="8" />
     <rect x="0" y="53" rx="0" ry="0" width="320" height="1" />
     <rect x="219" y="146" rx="0" ry="0" width="0" height="0" />
     </ContentLoader>
     )
  }

  return loaders;
}


const ChannelLoader = props => {
  return (
    loader_duplicator(5)
  )
}

export default ChannelLoader