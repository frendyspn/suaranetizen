<script>
  window.opener.postMessage({token: "{{ $token }}"}, "*");
  window.close();
</script>
