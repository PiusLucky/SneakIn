import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import moment from "moment";


const Code = ({state, avatar}) => {
  const codeBlock = `{ 
    user: {
      currentUser: {
        uid: ${state.uid},
        displayName: ${state.displayName},
        photoURL: ${state.photoURL ? state.photoURL: avatar },
        email: ${state.email},
        timestamp: {
          creationTime: ${moment(state.creationTime).format('LL')},
          lastSignInTime: ${moment(state.lastSignInTime).format('LLLL')}
        },     
      },
    }
}`
  return (
    <>
      <SyntaxHighlighter language="json" style={vscDarkPlus} className="sh-code">
        {codeBlock}
      </SyntaxHighlighter>
    </>
  );
};

export default Code;
