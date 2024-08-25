<template>
    <div class="not-found">
      <img src="https://sit-hposis.skriptr.tech/htdocs_error/something-lost.png" alt="404 Error" class="error-image"/>
      <h1>Page Error!</h1>
      <p>Either you may not have access to this page, or this page does not exist. </p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'NotFound'
  }
  </script>
  
  <style scoped>
  .not-found {
    text-align: center;
    padding: 50px;
  }
  
  .error-image {
    width: auto;
    height: auto;
  }
  
  h1 {
    font-size: 2em;
    margin-top: 20px;
  }
  
  p {
    font-size: 1.2em;
    margin-top: 10px;
  }
  </style>
  