class Ingredient {
    id;
    name;
    quantity;
    iconUrl;
    recipe;

    setId = id => { this.id = id; return this};
    setName = name => { this.name = name; return this};
    setQuantity = quantity => { this.quantity = quantity; return this};
    setIconUrl = iconUrl => { this.iconUrl = iconUrl; return this};
    setRecipe = recipe => { this.recipe = recipe; return this};
}

export default Ingredient;