import React from 'react'
import ContentLoader from 'react-content-loader'

const StarLoader = () => (

  <ContentLoader
    width={450}
    height={400}
    viewBox="0 0 450 400"
    backgroundColor="#f0f0f0"
    foregroundColor="#dedede"
    style={{ width: '100%' }}
  >
  <rect x="82" y="112" rx="3" ry="3" width="254" height="6" /> 
  <rect x="143" y="128" rx="3" ry="3" width="118" height="6" /> 
  <circle cx="181" cy="151" r="6" /> 
  <circle cx="211" cy="151" r="6" /> 
  <circle cx="241" cy="151" r="6" /> 
  <rect x="75" y="8" rx="19" ry="19" width="262" height="80" /> 
  <rect x="76" y="179" rx="19" ry="19" width="262" height="51" />
  </ContentLoader>

)


export default StarLoader;