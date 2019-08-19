const generateTextMessage = (from, text) => {
  return {
    from,
    text,
    createdAt: Date.now()
  }
}

const generateLocationMessage = (from, latitude, longitude) => {
  return {
    from,
    latitude, longitude,
    createdAt: Date.now()
  }
}

module.exports = {
  generateTextMessage, generateLocationMessage
}