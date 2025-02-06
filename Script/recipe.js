const API_KEY = 'ff62989519d641aaa9f1d00954397dbf'

async function recipeInstructions(recipeID) {
    if(!recipeID){
         recipeID = localStorage.getItem('selectedRecipeID')
    }
        const detailsUrl = `https://api.spoonacular.com/recipes/${recipeID}/information?apiKey=${API_KEY}`;
        try{
            const response = await fetch(detailsUrl)
            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }
            const recipe =  await response.json();

            const ingredientsList = recipe.extendedIngredients.map(ingredient => `<li>${ingredient.original}</li>`).join('')
            
            document.getElementById('recipe-page').innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}" class="recipe-image">
            <h2>${recipe.title}</h2>
            <p><strong>Ready in:</strong> ${recipe.readyInMinutes} minutes</p>
            <h2>Ingredients</h2>
            <ul>${ingredientsList || '<li>No ingredients available.</li>'}</ul>
            <h3>Instructions:</h3>
            <p>${recipe.instructions || 'No instructions available.'}</p>
        `;
    
        } catch (error) {
            console.error(`Error fetching recipe details: ${error.message}`);
            return null;
        }
    }
    document.addEventListener(('DOMContentLoaded'),()=>{
        recipeInstructions()
    });
