import { Component, OnInit, AfterViewInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { PostsService } from "../_services/posts.service";
import { Location } from "@angular/common";
declare const $: any;
@Component({
  selector: "app-search-page",
  templateUrl: "./search-page.component.html",
  styleUrls: ["./search-page.component.css"],
})
export class SearchPageComponent implements OnInit, AfterViewInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private postsService: PostsService,
    private location: Location
  ) {
    // To get search parameters from url

    this.activatedRoute.queryParamMap.subscribe((paramMap) => {
      this.urlParams.query = paramMap.get("query");
      (this.urlParams.searchInDescription =
        paramMap.get("searchInDesc") === "true" ? true : false),
        (this.urlParams.sortBy = paramMap.get("sortBy"));
      this.urlParams.firstPostsBy = paramMap.get("firstPostsBy");

      this.query.patchValue(this.urlParams.query);
      this.searchInDescription.patchValue(this.urlParams.searchInDescription);
      this.sortBy.patchValue(this.urlParams.sortBy);
      this.firstPostsBy.patchValue(this.urlParams.firstPostsBy);
    });

    this.searchQuery = new FormGroup({
      query: new FormControl(this.urlParams.query, { updateOn: "blur" }),
      category: new FormControl(this.urlParams.category),
      subcategory: new FormControl(this.urlParams.subcategory),
      searchInDescription: new FormControl(this.urlParams.searchInDescription),
      sortBy: new FormControl(this.urlParams.sortBy),
      firstPostsBy: new FormControl(this.urlParams.firstPostsBy),
    });

    this.activatedRoute.paramMap.subscribe((paramMap) => {
      const cat = parseInt(paramMap.get("categoryId"));
      const subcat = parseInt(paramMap.get("subcategoryId"));
      this.category.patchValue(cat);
      this.subcategory.patchValue(subcat);
    });
  }

  posts;

  // To give some time before submits
  updateTimeout;

  queryResultsInfo = {
    error: {
      display: false,
      message: "",
    },
    isLoading: false,
  };

  // Parameters from url
  urlParams = {
    query: "",
    category: 1,
    subcategory: 1,
    searchInDescription: false,
    sortBy: "",
    firstPostsBy: "",
  };

  // Form group for query
  searchQuery: FormGroup;

  searchQueryFormUI: any;

  // Getters for the form group
  get query() {
    return this.searchQuery.get("query");
  }
  get category() {
    return this.searchQuery.get("category");
  }
  get subcategory() {
    return this.searchQuery.get("subcategory");
  }
  get searchInDescription() {
    return this.searchQuery.get("searchInDescription");
  }
  get firstPostsBy() {
    return this.searchQuery.get("firstPostsBy");
  }
  get sortBy() {
    return this.searchQuery.get("sortBy");
  }

  // Function to show select option windows
  handleSelects(event) {
    const select = $(event.currentTarget);
    const showClass = "select-shown";
    const clickedElement = $(event.target);

    // If clicked at option
    if (clickedElement.hasClass("option")) {
      // Clicked at category selector
      if (select.hasClass("category")) {
        const chosenCategory = parseInt(clickedElement.attr("data-cat-id"));
        this.category.patchValue(chosenCategory);
        this.subcategory.patchValue(1);
        this.searchQueryFormUI.selectedCategory = clickedElement.find(
          ".option-name"
        )[0].innerHTML;

        this.changeSelectedSubcategory();
        this.changeSortBy();
      }
      // Clicked at subcategory selector
      else if (select.hasClass("subcategory")) {
        const chosenSubcategory = parseInt(
          clickedElement.attr("data-subcat-id")
        );
        this.changeSelectedSubcategory(chosenSubcategory);
      }
      // Clicked at order by selector
      else if (select.hasClass("first-posts-by")) {
        if (this.firstPostsBy.value === "asc") {
          this.firstPostsBy.patchValue("desc");
          this.searchQueryFormUI.firstPostsBy = "По убыванию";
        } else {
          this.firstPostsBy.patchValue("asc");
          this.searchQueryFormUI.firstPostsBy = "По возрастанию";
        }
      }
      //Clicked at sort by selector
      else if (select.hasClass("sort-by")) {
        this.changeSortBy();
      }
    }

    if (select.hasClass(showClass)) {
      select.removeClass(showClass);
    } else {
      select.addClass(showClass);
    }
  }

  changeSortBy() {
    if (this.category.value === 2) {
      if (this.sortBy.value === "title") {
        this.sortBy.patchValue("date");
        this.searchQueryFormUI.sortBy = "Дате";
      } else {
        this.sortBy.patchValue("title");
        this.searchQueryFormUI.sortBy = "Названию";
      }
    } else if (this.category.value === 3) {
      if (this.sortBy.value === "rating") {
        this.sortBy.patchValue("name");
        this.searchQueryFormUI.sortBy = "Имени";
      } else {
        this.sortBy.patchValue("rating");
        this.searchQueryFormUI.sortBy = "Рейтингу";
      }
    }
  }

  changeSelectedSubcategory(chosenSubcategory = 1) {
    const catId = this.category.value;
    const subcategoryOptions = $(".subcategory .option");

    subcategoryOptions.each((i) => {
      const option = $(subcategoryOptions[i]);
      const optionCatId = parseInt(option.attr("data-cat-id"));
      const optionSubcatId = parseInt(option.attr("data-subcat-id"));

      if (optionCatId === catId && optionSubcatId === chosenSubcategory) {
        this.searchQueryFormUI.selectedSubcategory = option.find(
          ".option-name"
        )[0].innerHTML;
        this.subcategory.patchValue(optionSubcatId);
        return false;
      }
    });
  }

  handleCheckboxes(event) {
    const cb = $($(event.currentTarget).find(".checkbox")[0]);
    const checkedClass = "checked";

    if (cb.hasClass(checkedClass)) {
      if (cb.hasClass("search-in-description")) {
        this.searchInDescription.patchValue(false);
      }
      cb.removeClass(checkedClass);
    } else {
      if (cb.hasClass("search-in-description")) {
        this.searchInDescription.patchValue(true);
      }
      cb.addClass(checkedClass);
    }
  }

  getArray(n) {
    n = parseInt(n);
    return Array(n).fill(0, 0, n);
  }


  formatDate(date) {
    date = new Date(date)
    const now = new Date();
    let display = {
      year: false,
      weekDay: false,
    };

    // If the same day
    if (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    ) {
      return `Сегодня, ${date.getHours()}:${date.getMinutes()}`;
    }

    if (date.getFullYear() !== now.getFullYear()) {
      return date.toLocaleString("ru-KZ", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }

    return date.toLocaleString("ru-KZ", {
      day: "numeric",
      month: "short",
    });
  }

  getPosts() {
    this.queryResultsInfo.error.display = false;
    this.queryResultsInfo.isLoading = true;

    this.postsService
      .getPosts(
        this.query.value,
        this.category.value,
        this.subcategory.value,
        this.searchInDescription.value,
        this.sortBy.value,
        this.firstPostsBy.value
      )
      .subscribe((data) => {
        console.log("Got posts!");
        this.queryResultsInfo.isLoading = false;
        this.posts = data;
        if (this.posts === false) {
          this.queryResultsInfo.error.display = true;
          this.queryResultsInfo.error.message =
            "По вашему запросу и параметрам не было ничего найдено. Проверьте их правильность и попробуйте еще раз.";
        } else if (this.posts.length === 0) {
          this.queryResultsInfo.error.display = true;
          this.queryResultsInfo.error.message =
            "По введенному запросу и примененным фильтрам не было ничего найдено. Проверьте параметры и попробуйте еще раз.";
        } else {
          this.queryResultsInfo.error.display = false;
        }
      });
  }

  stopUpdateTimeout() {
    clearTimeout(this.updateTimeout);
  }

  initializeValues() {
    $(".category .option").each((i) => {
      const option = $($(".category .option")[i]);
      if (parseInt(option.attr("data-cat-id")) === this.category.value) {
        this.searchQueryFormUI.selectedCategory = option.find(
          ".option-name"
        )[0].innerHTML;
        return false;
      }
    });
    $(".subcategory .option").each((i) => {
      const option = $($(".subcategory .option")[i]);
      if (
        parseInt(option.attr("data-cat-id")) === this.category.value &&
        parseInt(option.attr("data-subcat-id")) === this.subcategory.value
      ) {
        this.searchQueryFormUI.selectedSubcategory = option.find(
          ".option-name"
        )[0].innerHTML;
        return false;
      }
    });
    $(".sort-by .option").each((i) => {
      const option = $($(".sort-by .option")[i]);
      if (
        parseInt(option.attr("data-cat-id")) === this.category.value &&
        option.attr("data-name") === this.urlParams.sortBy
      ) {
        this.searchQueryFormUI.sortBy = option.find(
          ".option-name"
        )[0].innerHTML;

        return false;
      }
    });

    $(".first-posts-by .option").each((i) => {
      const option = $($(".first-posts-by .option")[i]);
      if (option.attr("data-name") === this.urlParams.firstPostsBy) {
        this.searchQueryFormUI.firstPostsBy = option.find(
          ".option-name"
        )[0].innerHTML;
      }
    });

    if (this.urlParams.searchInDescription) {
      $(".checkbox-container.search-in-description .checkbox").addClass(
        "checked"
      );
    }

    $(document).on("click", (e) => {
      const clickedElement = $(e.target);
      if (
        !clickedElement.hasClass("selected-option") &&
        !clickedElement.hasClass("option")
      ) {
        $(".select").each((i) => {
          $($(".select")[i]).removeClass("select-shown");
        });
      }
    });
  }

  ngAfterViewInit(): void {
    $(".select").on("click", (event) => {
      this.handleSelects(event);
    });
    $(".checkbox-container").on("click", (event) => {
      this.handleCheckboxes(event);
    });
  }

  ngOnInit(): void {
    this.searchQuery.valueChanges.subscribe((data) => {
      this.stopUpdateTimeout();

      this.location.replaceState(
        `search/${this.category.value}/${
          this.subcategory.value
        }?query=${this.query.value.trim()}&` +
          `searchInDesc=${this.searchInDescription.value}&` +
          `sortBy=${this.sortBy.value}&` +
          `firstPostsBy=${this.firstPostsBy.value}`
      );

      this.updateTimeout = setTimeout(() => {
        this.getPosts();
      }, 1000);
    });

    this.searchQueryFormUI = {
      selectedCategory: "",
      selectedSubcategory: "",
      firstPostsBy: "",
      sortBy: "",
    };
    // Set initial values
    this.initializeValues();
    this.getPosts();
  }
}
