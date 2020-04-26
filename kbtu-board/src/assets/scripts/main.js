
$(document).ready(() => {

  //To close windows when clicked somewhere else
  document.addEventListener("click", (e) => {
    const clickedElement = $(e.target);
    const profileWindow = $(".profile-window");
    const categorySelect = $("#category-select");
    const subcategorySelect = $("#subcategory-select");

    // If clicked anywhere but the select
    if (!clickedElement.hasClass("triangle") && !clickedElement.hasClass("select-container-inner")) {
      // Hide windows and rotate triangles back
      if (clickedElement.hasClass("category-option") || !clickedElement.hasClass("subcategory-option")) {
        if (categorySelect) {
          categorySelect.find(".triangle").removeClass("triangle-clicked");
          categorySelect.find(".options-window").removeClass("options-window-show");
          categorySelect.find(".select").removeClass("select-shown");

        }
      }
      if (clickedElement.hasClass("subcategory-option") || !clickedElement.hasClass("category-option")) {
        if (subcategorySelect) {
          subcategorySelect.find(".triangle").removeClass("triangle-clicked");
          subcategorySelect.find(".options-window").removeClass("options-window-show");
          subcategorySelect.find(".select").removeClass("select-shown");

        }
      }
    }
    if (!clickedElement.hasClass("option") && !clickedElement.hasClass("profile-container")) {
      $(".profile-window").removeClass("profile-window-show");
    }

  });


});
