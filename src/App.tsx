import ContentContainer from "./components/ContentContainer";
import { getHtml } from "./samples/page";
import { useState } from "react";
import { v4 } from "uuid";

function App() {
  const html = getHtml();
  const [containerId] = useState(v4());
  return (
    <div className="App">
      <div className="container">
        <h1 className="mt-5 mb-5">React HTML annotations</h1>
        <div className="card">
          <div className="card-body">
            <ContentContainer
              content={html}
              isHtml={true}
              containerId={containerId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
