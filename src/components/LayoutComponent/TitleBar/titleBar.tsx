import "./titleBar.css";

type ITitleBar = {
  title?: string;
};

export const TitleBar: React.FC<ITitleBar> = ({ title }) => {
  return (
    <>
      {/* Title Bar Card */}
      <div className="w3-col">
        <>
          <div className="w3-col w3-padding">
            <div className="w3-center w3-text-white titleBorder">
              <h4 className=" myfont1 titleFont">{title || "Title"}</h4>
            </div>
          </div>
        </>
      </div>
    </>
  );
};

export default TitleBar;
