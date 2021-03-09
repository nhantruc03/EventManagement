import { usePromiseTracker } from "react-promise-tracker";
import Loader from 'react-loader-spinner';
export const LoadingIndicator = props => {
  const { promiseInProgress } = usePromiseTracker();
  return (
    promiseInProgress &&
    <div className="loading">
      <Loader color="#10d8d8" type="ThreeDots" height="100" width="100" />
    </div>
  )
}