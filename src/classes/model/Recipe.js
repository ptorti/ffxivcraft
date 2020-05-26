class Recipe{

    id;
    item;
    ingredients = [];
    quantity;

    setId = id => { this.id = id; return this};
    setItem = item => { this.item = item; return this};
    setIngredients = ingredients => { this.ingredients = ingredients; return this};
    setQuantity = quantity => { this.quantity = quantity; return this};
}

export default Recipe;