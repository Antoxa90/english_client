const JSON_HEADER = 'application/json';

const getRequestParams = ( method, additionalHeaders = {} ) => {
  return {
    credentials: 'include',
    headers: {
      'Accept': JSON_HEADER,
      'Content-Type': JSON_HEADER,
      ...additionalHeaders
    },
    method,
  };
};

const getData = async ( url, additionalHeaders ) => {
  const response = await fetch(url, {
    ...getRequestParams('GET', additionalHeaders),
  });
  return processResponse(response);
};

const postData = async ( url, data, additionalHeaders ) => {
  const response = await fetch(url, {
    ...getRequestParams('POST', additionalHeaders),
    body: JSON.stringify(data)
  });
  return processResponse(response);
};

const putData = async ( url, data, additionalHeaders ) => {
  const response = await fetch(url, {
    ...getRequestParams('PUT', additionalHeaders),
    body: JSON.stringify(data)
  });
  return processResponse(response);
};

const deleteData = async ( url, data, additionalHeaders ) => {
  const response = await fetch(url, {
    ...getRequestParams('DELETE', additionalHeaders),
    body: JSON.stringify(data)
  });
  return processResponse(response);
};

const processResponse = (response) =>
  response.json().then((res) => {
    if (!response.ok) {
      throw res;
    }
    return res;
  } );

export {
  getData,
  postData,
  putData,
  deleteData,
};