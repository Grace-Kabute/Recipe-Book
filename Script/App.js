const API_KEY = 'ff62989519d641aaa9f1d00954397dbf';

async function getRecipes(recipeName = '', ingredients = '', recipeType = '', sortBy = 'popularity') {
    const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&query=${recipeName}&includeIngredients=${ingredients}&sort=${sortBy}&type=${recipeType}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        const json = await response.json();
        localStorage.setItem('recipes', JSON.stringify(json.results));

        displayRecipes(json.results, recipeType || 'All');

    } catch (error) {
        console.error(`Error fetching recipes: ${error.message}`);
    }
}

function recipesFromLocalStorage() {
    const storedRecipes = localStorage.getItem('recipes');
    if (storedRecipes) {
        const recipes = JSON.parse(storedRecipes);
        displayRecipes(recipes, 'All');
    } else {
        getRecipes();
    }
}
recipesFromLocalStorage()

function refreshRecipes() {
    localStorage.removeItem('recipes');
    getRecipes(); // Fetch fresh data
}
refreshRecipes()

function displayRecipes(recipes, category) {
    const recipeContainer = document.getElementById('recipe-container');
    recipeContainer.innerHTML = ''; // Clear previous content

    const categorySection = document.createElement('div');
    categorySection.classList.add('category-section');
    categorySection.innerHTML = `<h2>${category}</h2>`;

    recipes.forEach(recipe => {
        const recipeElement = document.createElement('div');
        recipeElement.classList.add('recipe-item');
        recipeElement.innerHTML = `
            <h3>${recipe.title}</h3>
            <img src="${recipe.image}" alt="${recipe.title}" class="recipe-image">
            <p>Ready in ${recipe.readyInMinutes} minutes</p>
            <a href="${recipe.sourceUrl}" target="_blank">View Recipe</a>
        `;
        categorySection.appendChild(recipeElement);
    });

    recipeContainer.appendChild(categorySection);
}


const categories = {
    allButton: '',
    mainCourseButton: 'mainCourse',
    dessertButton: 'dessert',
    appetizerButton: 'appetizer',
    breakfastButton: 'breakfast',
    veganButton: 'vegetarian',
    saladButton: 'salad',
    soupButton: 'soup',
    beveragesButton: 'beverage',
    cocktailButton: 'drink'
};
Object.keys(categories).forEach(buttonId => {
    document.getElementById(buttonId).onclick = () => getRecipes('', '', categories[buttonId], 'popularity');
});


// handle search bar logic
const searchBar = document.getElementById('search-bar')
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button')

searchButton.addEventListener('click', (event)=>{
event.preventDefault();
const searchTerm = searchInput.value;
searchInput.value = '';
const matchingResult = performSearch(searchTerm)
displayResults(matchingResult)
})

function performSearch(searchTerm){
    const storedRecipes = localStorage.getItem('recipes');
    if (!storedRecipes) return []
    const recipes = JSON.parse(storedRecipes)
    return recipes.filter(recipe => {
        const titleMatch = recipe.title.toLowerCase().includes(searchTerm);
        const ingredientMatch = recipe.missedIngredients?.some(ing => ing.name.toLowerCase().includes(searchTerm)) || recipe.usedIngredients?.some(ing => ing.name.toLowerCase().includes(searchTerm));
        return titleMatch || ingredientMatch;
    });}

function displayResults(results){
    if (results.length === 0){
        searchBar.innerHTML = 'recipe not found'
        return;
    }
    displayRecipes(results, 'search results')
}