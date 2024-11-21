export default defineNuxtRouteMiddleware(async (to) => {
  const token = useCookie("token");

  if (!token.value) {
    return navigateTo("/auth/login");
  }

  const { data, error } = await useFetch("/api/auth/verify");

  if (error.value || !data.value) {
    token.value = null;
    return navigateTo("/auth/login");
  }

  const user = data.value;
  const userStore = useUserStore();
  userStore.setUser(user);

  if (to.path.startsWith("/admin")) {
    if (user.role !== "admin") return navigateTo("/panel");
  }

  if (to.path.startsWith("/panel")) {
    if (user.role !== "admin" && user.role !== "user") return navigateTo("/auth/login");
  }
});
