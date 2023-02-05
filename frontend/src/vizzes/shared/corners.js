const useCorners = ({ width, height }, margin) => ({
  left: -width / 2 + margin,
  right: width / 2 - margin,
  top: height / 2 - margin,
  bottom: -height / 2 + margin
})

export default useCorners
