<template>
  <div>
    <h1>A single usr, with ID: {{ $route.params.id }}</h1>
  </div>
</template>

<script>

export default {
  validate (data) {
    return /^\d+$/.test(data.params.id);
  },
  layout: 'users'
}
</script>
