import { usePromiseTracker } from "react-promise-tracker";
// import Loader from 'react-loader-spinner';
import { Spin } from "antd";
export const LoadingIndicator = props => {
  const { promiseInProgress } = usePromiseTracker();
  return (
    promiseInProgress &&
    <div className="loading">
      {/* <Loader color="#2A9D8F" type="ThreeDots" height="100" width="100" /> */}
      <Spin size="large" style={{ color: '#2A9D8F' }} />
    </div>
  )
}