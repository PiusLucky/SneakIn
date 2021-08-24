import React from 'react'
import ContentLoader from 'react-content-loader'

const StarImageLoader = () => (

  <ContentLoader
    width={450}
    height={400}
    viewBox="0 0 450 400"
    backgroundColor="#f0f0f0"
    foregroundColor="#dedede"
    style={{ width: '100%' }}
  >
  <path d="M 484.52 64.61 H 15.65 C 7.1 64.61 0.17 71.2 0.17 79.31 v 220.51 c 0 8.12 6.93 14.7 15.48 14.7 h 468.87 c 8.55 0 15.48 -6.58 15.48 -14.7 V 79.31 c 0 -8.11 -6.93 -14.7 -15.48 -14.7 z m -9 204.34 c 0 11.84 -7.14 21.44 -15.94 21.44 h -23.19 l -77.23 -118.87 c -7.1 -10.92 -19.67 -11.16 -27 -0.51 l -73.52 106.93 C 253.78 285 245.73 286 240 280.2 l -79.75 -80.62 c -6 -6.06 -14.33 -5.7 -20 0.88 l -77.91 89.93 H 40.63 c -8.8 0 -15.94 -9.6 -15.94 -21.44 V 110.19 c 0 -11.84 7.14 -21.44 15.94 -21.44 h 418.91 c 8.8 0 15.94 9.6 15.94 21.44 z" />
  </ContentLoader>

)


export default StarImageLoader;