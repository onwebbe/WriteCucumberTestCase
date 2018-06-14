module.exports = function (source) {

  if (process.env.NODE_ENV === 'production') {
    console.log(source);
    return source.replace('__webpack_public_path__ + "static', '"..')
  } else {
    return source
  }

}