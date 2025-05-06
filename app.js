//Initial References
let result = document.getElementById("result");
let searchBtn = document.getElementById("search-btn");
let url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

searchBtn.addEventListener("click", () => {
    let userInp = document.getElementById("user-inp").value;
    let skeletonLoader = document.getElementById("skeleton-loader");
  
    if (userInp.length == 0) {
      result.innerHTML = `<h3>Input Field Cannot Be Empty</h3>`;
    } else {
      skeletonLoader.style.display = "block";
      result.innerHTML = "";
  
      fetch(url + userInp)
        .then((response) => response.json())
        .then((data) => {
          skeletonLoader.style.display = "none";
  
          if (!data.meals) {
            result.innerHTML = `<h3>No Results Found</h3>`;
            return;
          }
  
          let myMeal = data.meals[0];
          let count = 1;
          let ingredients = [];
          for (let i in myMeal) {
            if (i.startsWith("strIngredient") && myMeal[i]) {
              let ingredient = myMeal[i];
              let measure = myMeal[`strMeasure` + count];
              if (ingredient && measure) {
                ingredients.push(`${measure} ${ingredient}`);
              }
              count += 1;
            }
          }
  
          result.innerHTML = `
            <button id="close-results">Close</button>
            <img src=${myMeal.strMealThumb}>
            <div class="details">
                <h2>${myMeal.strMeal}</h2>
                <h4>${myMeal.strArea}</h4>
            </div>
            <div id="ingredient-con"></div>
            <div id="recipe">
                <button id="hide-recipe">X</button>
                <pre id="instructions">${myMeal.strInstructions}</pre>
            </div>
            <button id="show-recipe">View Recipe</button>
          `;
  
          let ingredientCon = document.getElementById("ingredient-con");
          let parent = document.createElement("ul");
          ingredients.forEach((i) => {
            let child = document.createElement("li");
            child.innerText = i;
            parent.appendChild(child);
            ingredientCon.appendChild(parent);
          });
  
          let closeResults = document.getElementById("close-results");
          closeResults.addEventListener("click", () => {
            result.innerHTML = ""; // Clear the results
            document.getElementById("user-inp").value = ""; // Reset the input field
          });
  
          let recipe = document.getElementById("recipe");
          let hideRecipe = document.getElementById("hide-recipe");
          let showRecipe = document.getElementById("show-recipe");
  
          hideRecipe.replaceWith(hideRecipe.cloneNode(true));
          showRecipe.replaceWith(showRecipe.cloneNode(true));
  
          hideRecipe = document.getElementById("hide-recipe");
          showRecipe = document.getElementById("show-recipe");
  
          hideRecipe.addEventListener("click", () => {
            recipe.style.display = "none";
          });
          showRecipe.addEventListener("click", () => {
            recipe.style.display = "block";
          });
        })
        .catch(() => {
          skeletonLoader.style.display = "none";
          result.innerHTML = `<h3>Invalid Input</h3>`;
        });
    }
  });