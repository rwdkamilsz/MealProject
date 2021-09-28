const searchBar = document.querySelector(".searchBar"),
  searchButton = document.querySelector(".searchButton"),
  warningBox = document.querySelector(".warningBox"),
  warningMessage =
    "Ooops! Something went wrong or we can't find meal with this name. Try again!";

const Meal = {
  apiURL: "https://www.themealdb.com/api/json/v1/1/",
  randomMealAPI: "random.php",
  searchMealAPI: "search.php?s=",
  ingredientSearchAPI: "filter.php?i=",
  getRandomMealObject: async function () {
    try {
      const res = await fetch(this.apiURL + this.randomMealAPI);
      let data = await res.json();
      data = data.meals[0];
      this.displayMeal(data, "inspiration");
      console.log(data);
    } catch (error) {
      console.log(error);
      warningBox.innerHTML = warningMessage;
      warningBox.classList.toggle("hide");
    }
  },
  displayMeal: (data, type) => {
   
    if (type === "search" || type === "inspiration") {
        document.getElementById("mealCard").classList.remove("hide");
      switch (type) {
        case "search":
          document.querySelector(
            ".mealName"
          ).innerText = `You searched for ${data.strMeal}`;
          break;
        case "inspiration":
          document.querySelector(
            ".mealName"
          ).innerText = `Your inspiration is ${data.strMeal}`;
          break;
      }
      try {
        document.querySelector(
          ".mealRegion"
        ).innerText = `${data.strArea} recipe`;
        document.querySelector(".mealImage").src = data.strMealThumb;
        document.querySelector(".mealImage").alt = `Picture of ${data.strMeal}`;
        document.querySelector(".mealInstructions").innerText =
          data.strInstructions;

        warningBox.classList.add("hide");
        const ingredientList = document.querySelector(".mealIngredients__list");
        while (ingredientList.firstElementChild)
          ingredientList.firstElementChild.remove();
        for (let i = 1; i < 16; i++) {
          if (!data[`strIngredient${i}`]) break;
          let listItem = document.createElement("li");
          listItem.innerHTML =
            data[`strIngredient${i}`] + " - " + data[`strMeasure${i}`];
          ingredientList.appendChild(listItem);
        }
        document.body.style.background = `url("${data.strMealThumb}") no-repeat center center`;
        document.body.style.backgroundSize = `cover`;
      } catch (error) {
        throw new Error(error);
      }
    } else {
      mealList = document.querySelector(".mealListing");
      try {
        for (let i = 1; i < data.meals.length; i++) {
          if (!data.meals[`${i}`]) break;
          meal = data.meals[`${i}`];
          let listItem = document.createElement("li");
            
          listItem.innerHTML = `                    
                    <li class="media" data-meal-id="${meal.idMeal}">
                    <div class="row align-items-center">
                      <div class="col-sm-6"> 
                          <img src="${meal.strMealThumb}"  class="img-thumbnail" alt="Meal image">
                    </div>
                      <div class="col-sm-6">
                          <div class="media-body">
                              <h5>${meal.strMeal}</h5>
                       
                          </div>
                      </div>
                    </div>
                  </li>`;
          mealList.appendChild(listItem);
        }
      } catch (error) {
        throw new Error(error);
      }
    }
  },

  search: async function (item, type) {
    if (!item) return this.boxWarning();
   if(type!== 'ingredient'){
    try {
        const res = await fetch(this.apiURL + this.searchMealAPI + item);
        let data = await res.json();
        data = data.meals[0];
        this.displayMeal(data, "search");
      } catch (error) {
        console.log(error);
        this.boxWarning();
      }
   }
   else{
    try {
        const res = await fetch(this.apiURL + this.ingredientSearchAPI + item);
        let data = await res.json();
        this.displayMeal(data, type);
       
      } catch (error) {
        console.log(error);
        message = 'Ooops! Something went wrong or we can\'t find meals with searched ingredient. Try again!';
      
        this.boxWarning(message);
      }
   }
  },
  boxWarning: (text) => {
      console.log(text);
    (text === undefined) ? warningBox.innerHTML = warningMessage  : warningBox.innerHTML = text  ;
    
    warningBox.classList.toggle("hide");
  },
};

const randomMealButton = document.querySelector(".getRandomMeal");

function searchInteraction(type) {
  switch (type) {
    case "meal":
      Meal.search(searchBar.value, type);
      searchBar.value = "";
      break;
    case "ingredient":
        console.log(type);
      Meal.search(searchBar.value, type);
      searchBar.value = "";
      break;

    default:
      break;
  }
}

if (randomMealButton) {
  randomMealButton.addEventListener("click", () => {
    Meal.getRandomMealObject();
  });
}
if (searchButton)
{
  searchButton.addEventListener("click", (target) => {
    type = target.target.attributes["data-type"].value;
    searchInteraction(type);
  });
}
