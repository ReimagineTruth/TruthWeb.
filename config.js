// config.js
window.envConfig = {
  NODE_ENV: '<%= process.env.NODE_ENV %>',
};
<script src="config.js"></script>
<script>
  Pi.init({
    version: "2.0", 
    sandbox: window.envConfig.NODE_ENV !== 'production'
  });
</script>
