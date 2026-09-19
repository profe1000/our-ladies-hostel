import "./Nopage.css";
import { Link } from "react-router-dom";
import { Button, Result } from "antd";

const Nopage = () => {
  return (
    <div className="w3-text-white w3-margin-top">
      <Result
        status="404"
        title={<span className="w3-text-white">404</span>}
        subTitle={
          <span className="w3-text-white">
            Sorry, See you are on a broken page
          </span>
        }
        extra={
          <Button className="w3-yellow" type="primary">
            <Link to="/">Go to Home</Link>
          </Button>
        }
      />
    </div>
  );
};

export default Nopage;
