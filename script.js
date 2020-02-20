var Meal = function() {
    this.meal = {
        name: null,
        ingredients: [],
        instructions: null,
        picture: null
    };

    this.getRandom = function () {
        var url = "https://www.themealdb.com/api/json/v1/1/random.php";

        this.getResponse(url).then(data => {
            this.parseDatas(data);
            this.setInfos();
        });
    };

    this.getResponse = async function (url) {
        try {
            let response = await fetch(url);
            if (response.ok) {
                return await response.json();
            } else {
                console.error("Error: ", response.status);
            }
        } catch (error) {
            console.log(error);
        }
    };

    this.parseDatas = function(data) {
        data = data.meals[0];

        this.meal.name = data.strMeal;
        this.meal.instructions = data.strInstructions;
        this.meal.picture = data.strMealThumb;
        this.meal.ingredients = [];
        for (const key of Object.keys(data)) {
            if (data[key] && key.indexOf("Ingredient") !== -1) {
                this.meal.ingredients.push(data[key])
            }
        }
        this.meal.ingredients = this.meal.ingredients.slice(0, 10);
    };

    this.setInfos = function() {
        var title = document.getElementsByClassName("title")[0];
        var picture = document.getElementsByClassName("picture")[0].getElementsByTagName("img")[0];
        var instructions = document.getElementsByClassName("instructions")[0];
        
        title.innerHTML = this.meal.name;
        picture.src = this.meal.picture;
        instructions.innerHTML = this.meal.instructions;
        this.createListIngredients();
    };

    this.createListIngredients = function() {
        var ingredients = document.getElementsByClassName("ingredients-container")[0];
        removeChildsElement(ingredients);
        this.meal.ingredients.forEach(function (element) {
            createDivWithParent(ingredients, null, null, element);
        });
    };
};

/************************** TOOLS ***************************/
var createDivWithParent = function(parent, id, className, msg) {
    var div = document.createElement("div");
    if (id) { div.id = id; }
    if (className) { div.className = className; }
    if (msg) { div.innerHTML = msg; }
    parent.appendChild(div);
};

var removeChildsElement = function(parent) {
    var child = parent.lastElementChild;
    while (child) {
        parent.removeChild(child);
        child = parent.lastElementChild;
    }
    return parent;
}

window.onload = function() {
    var btn = document.getElementsByTagName("button")[0];
    var meal = new Meal();
    btn.addEventListener("click", function() { meal.getRandom(); });
};