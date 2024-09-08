let isToastVisible = false;

export const showToast = ($toast, time) => {
  if (isToastVisible) return;

  isToastVisible = true;

  $toast.className = "toast show";

  setTimeout(() => {
    $toast.className = $toast.className.replace("show", "");
    isToastVisible = false;
  }, time);
};
