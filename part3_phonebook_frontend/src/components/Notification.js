import React from 'react'

const Notification = ({ notification }) => {
  const mainStyle = {
    color: "blue",
    border: "1px solid blue",
    padding: ".3em"
  }
  
  const errorStyle = {
    ...mainStyle,
    color: "red",
    borderColor: "red"
  }
  
  const successStyle = {
    ...mainStyle,
    color: "green",
    borderColor: "green"
  }
  
  if (notification.message === null) return null;

  return (
    <p style={notification.type === "error" ? errorStyle : notification.type === "success" ? successStyle : mainStyle}>
      {notification.message}
    </p>
  )
}

export default Notification
