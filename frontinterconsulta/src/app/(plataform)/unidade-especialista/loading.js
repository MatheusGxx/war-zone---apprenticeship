import PreloaderInterno from '../../partials/PreloaderInterno'

const Loading = () => {
  return (
    <PreloaderInterno />
  )
}

// Add a message prop to customize the loading message
Loading.propTypes = {
  message: PropTypes.string
}

Loading.defaultProps = {
  message: 'Loading...'
}

// Add a message to the loading component
const LoadingWithMessage = ({ message }) => {
  return (
    <div>
      {message}
      <PreloaderInterno />
    </div>
  )
}

// Use LoadingWithMessage instead of Loading when you want to customize the message
export { Loading, LoadingWithMessage }
